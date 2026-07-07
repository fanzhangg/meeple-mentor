import json
import re
import shutil
import sys
from pathlib import Path

import pdfplumber


HEADING_HINTS = [
    "Overview",
    "Setup",
    "States",
    "Play",
    "Positioning a Leader",
    "Placing a Tile",
    "Victory Points",
    "Pagodas",
    "Conflicts",
    "Peasants Riot",
    "Replacing Tiles",
    "End of the Game",
    "Optional Rules",
]


def normalize_text(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = re.sub(r"(?<=\w)-\n(?=\w)", "", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf_text(pdf_path: Path) -> list[tuple[int, str]]:
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            pages.append((page_number, normalize_text(text)))
    return pages


def make_clean_markdown(pdf_path: Path, pages: list[tuple[int, str]]) -> str:
    body = [
        "# HUANG Rules",
        "",
        "> Draft extracted from the provided PDF. Review this file before treating it as canonical teaching text.",
        "",
        "## Review Notes",
        "",
        "- The original PDF uses a visual, multi-column layout; extraction may interleave nearby columns.",
        "- Keep one game per `clean.md`; do not add other games to this file.",
        "- The app uses this reviewed markdown as the rule source, not the PDF at runtime.",
        "",
        "## Source",
        "",
        f"- Original file: `{pdf_path.name}`",
        "",
        "## Extracted Rules",
    ]
    for page_number, text in pages:
        body.extend(["", f"### Page {page_number}", ""])
        body.append(text if text else "_No selectable text extracted from this page._")
    return "\n".join(body).strip() + "\n"


def split_sections(markdown: str) -> list[dict]:
    sections = []
    current = {"id": "intro", "title": "Introduction", "content": []}
    for line in markdown.splitlines():
        heading = re.match(r"^(#{2,3})\s+(.+)$", line)
        if heading:
            if current["content"]:
                sections.append(
                    {
                        "id": slugify(current["title"]),
                        "title": current["title"],
                        "content": "\n".join(current["content"]).strip(),
                    }
                )
            current = {"id": "", "title": heading.group(2).strip(), "content": []}
        else:
            current["content"].append(line)
    if current["content"]:
        sections.append(
            {
                "id": slugify(current["title"]),
                "title": current["title"],
                "content": "\n".join(current["content"]).strip(),
            }
        )
    return [section for section in sections if section["content"]]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "section"


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: extract_pdf.py <input.pdf> <game-dir>", file=sys.stderr)
        return 2

    pdf_path = Path(sys.argv[1]).resolve()
    game_dir = Path(sys.argv[2]).resolve()
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 1

    game_dir.mkdir(parents=True, exist_ok=True)
    source_dir = game_dir / "source"
    source_dir.mkdir(exist_ok=True)

    pages = extract_pdf_text(pdf_path)
    clean_markdown = make_clean_markdown(pdf_path, pages)
    sections = split_sections(clean_markdown)

    (game_dir / "clean.md").write_text(clean_markdown, encoding="utf-8")
    (game_dir / "sections.json").write_text(
        json.dumps({"game": "huang", "sections": sections, "headingHints": HEADING_HINTS}, indent=2),
        encoding="utf-8",
    )
    shutil.copy2(pdf_path, source_dir / "rules.pdf")

    extracted_chars = sum(len(text) for _, text in pages)
    print(f"Wrote {game_dir / 'clean.md'}")
    print(f"Wrote {game_dir / 'sections.json'}")
    print(f"Copied PDF reference to {source_dir / 'rules.pdf'}")
    print(f"Extracted {extracted_chars} characters across {len(pages)} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
