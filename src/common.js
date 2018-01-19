function isNotEmpty (s) {
  return s !== '' && s !== null && s !== undefined
}

function isEmpty (s) {
  return s === '' || s === null || s === undefined
}

function formatRepoSelection (repo) {
  return repo.id
}

function formatRepo (repo) {
  return repo.text
}
