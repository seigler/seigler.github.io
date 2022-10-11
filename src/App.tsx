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
  description: string | null
  homepage: string | null
  stargazers_count: number
  topics: string[]
  fork: boolean
}

const sourceFullName = 'seigler/seigler.github.io'

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
const filter = signal<(r: GithubRepo) => boolean>(() => true)

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
      if (isLoading.value === false) {
        repos.value = [
          ...repos.value.sort((a, b) =>
            a.created_at < b.created_at
              ? 1
              : a.created_at > b.created_at
              ? -1
              : 0
          )
        ]
      }
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
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--gap)'
          }}>
          <button onClick={() => (filter.value = () => true)}>All</button>
          {topics.value.map(({ topic, count }) => (
            <button
              onClick={() => (filter.value = (r) => r.topics.includes(topic))}>
              {topic}: {count}
            </button>
          ))}
        </nav>
      </header>
      {isLoading.value ? (
        <span class="loader"></span>
      ) : (
        <main class="grid-container">
          {repos.value.filter(filter.value).map((repo) => (
            <div key={repo.id} className="grid-item" style={{ '--width': '4' }}>
              <RepoCard repo={repo} />
            </div>
          ))}
        </main>
      )}
      <footer>
        Styles based on <a href="https://simplecss.org/">simple.css</a>. Data
        from GitHub API.{' '}
        <a href={`https://github.com/${sourceFullName}`}>Source code</a>
      </footer>
    </>
  )
}

render(<App />, document.getElementById('root'))
