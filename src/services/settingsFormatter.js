// settings.json => data.json

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const settingsFormatter = (rawSettings, round) => {
    if (!round) {
        return({
            parts: [],
            queue: [],
            round: round,
        });
    }

    const {facs: facSettings, lastWinner} = rawSettings;

    let parts = Object.keys(facSettings).filter((fac) => 
        facSettings[fac].isParticipant && lastWinner !== fac
    );

    // semi
    if (round < 3) {
        parts = parts.filter((fac) => round === facSettings[fac].semi);
    } 

    let queue = parts.filter(fac => facSettings[fac].isFinal)
    shuffleArray(queue)

    // final
    if (round === 3) {
        queue.push(lastWinner);

        // по убыванию баллов жюри
        queue.sort((a, b) => facSettings[b].scoreJudge - facSettings[a].scoreJudge);
        
        parts = queue.reduce((result, fac) => ({
            ...result, 
            [fac]: {
                judge: facSettings[fac].scoreJudge,
                audience: facSettings[fac].scoreAudience,
            }}),
            {}
        );
        //queue.sort((a, b) => parts[b].judge - parts[a].judge)
        queue = queue.toReversed();
        
        // parts = queue.map((fac) => ([fac, facSettings[fac].scoreJudge]));
        // parts.sort((a, b) => b[1] - a[1]);

        // queue = parts.toReversed().map(([fac,]) => ([fac, facSettings[fac].scoreAudience]));

        
    }

    return ({
        parts: parts,
        queue: queue,
        round: round,
    });
}