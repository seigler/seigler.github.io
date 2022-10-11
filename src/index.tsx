import { h, Fragment, render } from 'preact'
import { useEffect } from 'preact/hooks'
import { computed, signal } from '@preact/signals'
import { RepoCard } from './repoCard'
import * as LinkHeader from 'http-link-header'

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  created_at: string
  homepage: string | null
  stargazers_count: number
  topics: string[]
  fork: boolean
}

const repos = signal<GithubRepo[]>([])
const topics = computed(() => {
  const map = repos.value.reduce((map, repo) => {
    repo.topics.forEach((topic) => map.set(topic, 1 + (map.get(topic) ?? 0)))
    return map
  }, new Map<string, number>())
  return [...map.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .filter(({ count }) => count > 1)
})
const isLoading = signal(true)

function fetchDataUntilNoNext(uri: string) {
  fetch(uri)
    .then((response) => {
      const link = LinkHeader.parse(response.headers.get('Link'))
      const [rel] = link.rel('next')
      if (rel) {
        const { uri } = rel
        fetchDataUntilNoNext(uri)
      } else {
        isLoading.value = false
      }
      return response.json()
    })
    .then((data) => {
      repos.value = repos.value.concat(data)
    })
    .catch((reason) => console.error("Couldn't fetch repos because:", reason))
}

function App() {
  useEffect(
    () =>
      fetchDataUntilNoNext(
        'https://api.github.com/users/seigler/repos?per_page=30'
      ),
    []
  )

  return (
    <>
      <header>
        <h1>Joshua Seigler's github repos</h1>
      </header>
      <main>
        {topics.value.map(({ topic, count }) => (
          <div>
            {topic}: {count}
          </div>
        ))}
        {repos.value.map((repo) => (
          <RepoCard repo={repo} />
        ))}
      </main>
    </>
  )
}

render(<App />, document.getElementById('root'))
