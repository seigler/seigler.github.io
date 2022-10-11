import { h, Fragment, render } from 'preact'
import { GithubRepo } from '.'

export function RepoCard({ repo }: { repo: GithubRepo }) {
  return <div>{repo.full_name}</div>
}
