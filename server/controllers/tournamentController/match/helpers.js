export const normaliseResults = rawResults => Object.entries(rawResults).map(([userId, results]) => ({
    userId,
    results: Object.entries(results).map(([ruleId, value]) => {
      ruleId, value;
    })
  }));