export function searchTopics(topics, query, activeId) {
  const normalize = value => value.normalize('NFKC').replace(/\s+/g, '').toLocaleLowerCase();
  const term = normalize(query);
  if (!term) return topics.filter(topic => topic.id === activeId);
  return topics.flatMap(topic => {
    const {details = [], ...main} = topic;
    const matches = value => normalize(JSON.stringify(value)).includes(term);
    if (matches(main)) return [{...topic, searchOpen: true}];
    const matchingDetails = details.filter(matches);
    return matchingDetails.length ? [{...topic, details: matchingDetails, searchOpen: true}] : [];
  });
}

export function createQuizSession(questions) {
  const answers = new Map();
  const drafts = new Map();
  return {
    answers,
    drafts,
    submit(id, selected) {
      const question = questions.find(item => item.id === id);
      if (!question || !Number.isInteger(selected) || !question.options[selected]) return false;
      answers.set(id, {selected});
      drafts.delete(id);
      return true;
    },
    retry(id) {
      answers.delete(id);
      drafts.delete(id);
    },
    reset() {
      answers.clear();
      drafts.clear();
    },
    summary() {
      const wrong = questions.filter(q => answers.has(q.id) && answers.get(q.id).selected !== q.answer);
      const missing = questions.filter(q => !answers.has(q.id));
      return {wrong, missing, correct: answers.size - wrong.length};
    }
  };
}
