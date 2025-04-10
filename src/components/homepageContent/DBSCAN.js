const maxClusterSpace = 1 //Zeroes before new cluster
const minClusterLength = 2 //Shortest Clusters allowed
const maxEpisodeSpace = 3 //Zeroes before new episode

export function DBSCAN(filledArray){
    
    let epStartTime = 0
    let epEndTime = 0

    let epStartIndex = 0
    let epEndIndex = 0

    let epLength = 0
    let potEpLength = 0

    let trailingZeroCount = 0

    let clusterData = []

    for(let i = 0; i<filledArray.length; i++)
    {
        let currObj = filledArray[i]
        if(epLength == 0){
            if(currObj.gr[0] == 1){
                epStartTime = currObj.ts
                epStartIndex = i
                epEndTime = currObj.ts
                epEndIndex = i
                epLength = epLength + 1
                potEpLength = epLength
            }
   
            

        }
        else{
            if(currObj.gr[0] == 1){
                epEndTime = currObj.ts
                epEndIndex = i
                if(trailingZeroCount > 0){
                    trailingZeroCount = 0
                    potEpLength = potEpLength + 1
                    epLength = potEpLength
                }
                else{
                    epLength = epLength + 1
                    potEpLength = epLength
                }
            }
            else{
                trailingZeroCount = trailingZeroCount + 1

                if(trailingZeroCount > maxClusterSpace){
                    trailingZeroCount = 0
                    

                    clusterData.push({
                        clusterStartTime: epStartTime,
                        clusterEndTime: epEndTime,
                        clusterStartIndex: epStartIndex,
                        clusterEndIndex: epEndIndex,
                        clusterLength: epLength,
                    })

                    epLength = 0
                    potEpLength = 0
                }
                else{
                    potEpLength = potEpLength + 1
                }
            }
        }
    }


    if(epLength>0){
        clusterData.push({
            clusterStartTime: epStartTime,
            clusterEndTime: epEndTime,
            clusterStartIndex: epStartIndex,
            clusterEndIndex: epEndIndex,
            clusterLength: epLength,
        })
    }
    return(clusterData)


}

export function clusterReduce(filledArray){
    
    
    let clusters = DBSCAN(filledArray)
    let reducedClusters = []

    for(let i = 0; i < clusters.length; i++){
        if(clusters[i].clusterLength>minClusterLength){
            reducedClusters.push(clusters[i])
        }
    }
    return(reducedClusters)
}

export function findEpisodes(filledArray){
    let reducedClusters = clusterReduce(filledArray)
    if(reducedClusters.length == 0){
        return []
    }
    
    let episodes = []
    let currEndIndex = 0
    let nextBegIndex = 0


    let episodeStartTime = reducedClusters[0].clusterStartTime
    let episodeEndTime = reducedClusters[0].clusterEndTime
    let episodeLength = reducedClusters[0].clusterLength

    for(let i = 0; i < reducedClusters.length-1; i++)
    {
        let curr = reducedClusters[i]
        let next = reducedClusters[i+1]

        currEndIndex = reducedClusters[i].epEndIndex
        nextBegIndex = reducedClusters[i+1].epStartIndex

        if(currEndIndex - nextBegIndex <= maxEpisodeSpace){
            episodeEndTime = next.clusterEndTime
            episodeLength = episodeLength + next.clusterLength
        }
        else{
            episodes.push({
                startTime: episodeStartTime,
                endTime: episodeEndTime,
                length: episodeLength,
            })
            episodeStartTime = next.clusterStartTime
            episodeEndTime = next.clusterEndTime
            //length = next.clusterLength
        }
    }

    episodes.push({
        startTime: episodeStartTime,
        endTime: episodeEndTime,
        length: episodeLength,
    })

    return episodes

}
