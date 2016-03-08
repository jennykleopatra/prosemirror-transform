function canBeJoined(node, offset, depth) {
  if (!depth || offset == 0 || offset == node.size) return false
  let left = node.child(offset - 1), right = node.child(offset)
  return left.sameMarkup(right)
}

export function replaceHasEffect(doc, from, to) {
  for (let depth = 0, node = doc;; depth++) {
    let fromEnd = depth == from.depth, toEnd = depth == to.depth
    if (fromEnd || toEnd || from.path[depth] != to.path[depth]) {
      let gapStart, gapEnd
      if (fromEnd) {
        gapStart = from.offset
      } else {
        gapStart = from.path[depth] + 1
        for (let i = depth + 1, n = node.child(gapStart - 1); i <= from.path.length; i++) {
          if (i == from.path.length) {
            if (from.offset < n.size) return true
          } else {
            if (from.path[i] + 1 < n.size) return true
            n = n.child(from.path[i])
          }
        }
      }
      if (toEnd) {
        gapEnd = to.offset
      } else {
        gapEnd = to.path[depth]
        for (let i = depth + 1; i <= to.path.length; i++) {
          if ((i == to.path.length ? to.offset : to.path[i]) > 0) return true
        }
      }
      if (gapStart != gapEnd) return true
      return canBeJoined(node, gapStart, Math.min(from.depth, to.depth) - depth)
    } else {
      node = node.child(from.path[depth])
    }
  }
}

// : (Pos, Pos) → number
// Get the number of path levels that two positions have in common.
export function samePathDepth(a, b) {
  for (let i = 0;; i++)
    if (i == a.path.length || i == b.path.length || a.path[i] != b.path[i])
      return i
}
