import { h, Fragment, render } from 'preact'
import type { GithubRepo } from './App'
import dayjs from 'dayjs'

export function RepoCard({ repo }: { repo: GithubRepo }) {
  const {
    id,
    name,
    full_name,
    html_url,
    created_at,
    description,
    homepage,
    stargazers_count,
    topics,
    fork
  } = repo
  return (
    <div class="card">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
        <strong>
          <a href={homepage || html_url}>{name}</a>
        </strong>
        {stargazers_count ? <div>{stargazers_count}⭐</div> : null}
        {homepage && (
          <div style={{ width: '100%', fontSize: '0.8em' }}>
            <a href={html_url}>source</a>
          </div>
        )}
      </header>
      <p style={{ flexGrow: 1 }}>{description}</p>
      <footer>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'calc(var(--gap) / 4)'
          }}>
          {topics.map((t) => (
            <span class="tag">{t}</span>
          ))}
        </div>
        <small>Created {dayjs(created_at).format('MMM D, YYYY')}</small>
      </footer>
    </div>
  )
}
