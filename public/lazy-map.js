
define([], function() {
  function lazyMap(opts) {
    if(!opts.sourceArr)  throw new Error('must provide sourceArr')
    if(!opts.targetArr)  throw new Error('must provide targetArr')
    if(!opts.createFunc)    throw new Error('must provide createFunc')
    if(!opts.updateFunc) throw new Error('must provide updateFunc')

    var hasMutated = false
    if (!opts.sourceArr) {
      opts.targetArr.removeAll()
    } else {
      
      opts.sourceArr.forEach(function(sourceData, i) {
        if (opts.targetArr[i]) { opts.updateFunc(sourceData, opts.targetArr[i]) } 
        else {
          opts.targetArr[i] = opts.createFunc(sourceData)
          hasMutated = true
        }
      })

      if(opts.targetArr.length !== opts.sourceArr.length) {
        opts.targetArr.length = opts.sourceArr.length
        hasMutated = true
      }
    }
    return hasMutated
  }

  return lazyMap
})