export default chartData => {
  const data = chartData.reduce((g, t) => {
    g[Math.floor(t.anonymitySet)] =
      (g[Math.floor(t.anonymitySet)] || 0) + t.amount;
    return g;
  }, {});
  const sortedAnonsetTotalPairs = Object.entries(data).sort(
    ([anonset1], [anonset2]) => anonset1 - anonset2,
  );
  if (sortedAnonsetTotalPairs.length < 2) {
    sortedAnonsetTotalPairs.unshift(sortedAnonsetTotalPairs[0]);
  }
  const chartStats = sortedAnonsetTotalPairs.reduce(
    (stats, [anonset, total], i) => {
      const cumTotal = sortedAnonsetTotalPairs
        .slice(i)
        .reduce((totalToIndex, [, t1]) => totalToIndex + t1, 0);
      stats.series.push([Number(anonset), cumTotal]);
      stats.maxY = Math.max(cumTotal, stats.maxY);
      stats.maxX = Math.max(anonset, stats.maxX);
      stats.minY = Math.min(cumTotal, stats.minY);
      stats.minX = Math.min(anonset, stats.minX);
      return stats;
    },
    {series: [], minX: 99999, maxX: null, minY: null, maxY: null},
  );
  return chartStats;
};
