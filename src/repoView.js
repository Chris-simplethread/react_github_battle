import React from 'react';
import agent from './agent'
// import ReactDOM from 'react-dom';

const Repo = {
  url: '',
  stars: null,
  forks: null,
  watchers: null,
  isWinner: false,
};

const thousands = (value) => {return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';};

function AnnounceWinner(props) {
  if (props.isWinner) {
    return (
      <h1 className="winner">
        {props.winner.repo} is the winner<br />with {thousands(props.winner.stars)} stars!
      </h1>
    );
  } else {
    return(null);
  }
}

function RepoView(props) {
  const isWinner = props.repo.isWinner || false;
  return (
    <div className="repo-section">
      <label className={"repo-section__label" + (isWinner ? ' winningRepo' : '')}>
        Repo URL <span className="small">https://github.com/{props.repo.url}</span>
        <input type="text"
               className="repo-section__input"
               placeholder="user/repo"
               onChange={props.onChange}
               value={props.repo.url}
               name={props.repo.index}
          />
      </label>
      <div className="repoStat__section" >
        <dl className="repoStat__wrapper">
          <dt className="repoStat__key">Star Count</dt>
          <dd className="repoStat__value">{thousands(props.repo.stars)}</dd>
        </dl>
        <dl className="repoStat__wrapper">
          <dt className="repoStat__key">Watcher Count</dt>
          <dd className="repoStat__value">{thousands(props.repo.watchers)}</dd>
        </dl>
        <dl className="repoStat__wrapper">
          <dt className="repoStat__key">Fork Count</dt>
          <dd className="repoStat__value">{thousands(props.repo.forks)}</dd>
        </dl>
      </div>


    </div>
  );
}


class BattleZone extends React.Component {
  constructor() {
    super();
    this.state = {
      repos: Array(2).fill().map((_, i) => this.buildRepo(i)),
      // winner: null
      errors: null,
    };
  }

  buildRepo(i) {
    return Object.assign({index: i}, Repo);
  }

  handleChange(event) {
    const target = event.target;
    const val = target.value;
    const index = target.name;
    const repos = this.state.repos.slice();

    const current = repos[index];
    current.url = val;

    this.setState({
      repos: repos
    });
  }

  handleSubmit() {
    const repos = this.state.repos.slice();
    const isURLNeeded = !repos.every((_) => _.url);

    if (isURLNeeded) {
      this.setState( Object.assign(this.state, {errors: 'Both Repos need URLs'}) );
      console.log('URLs needed');
      // this.render();
    } else {

      repos.map((repo, index, collection) => {
        const url = repo.url;
        agent.GHRepo.get(url)
          .then((resp)=>{
            const enrich = {
              stars: resp.stargazers_count,
              watchers: resp.watchers_count,
              forks: resp.forks_count,
            };
            Object.assign(collection[index], enrich);
          })
          .then(() => {
            let one = collection[0];
            let two = collection[1];

            if (two.stars && one.stars > two.stars) {
              one.isWinner = true;
            } else if (one.stars && two.stars > one.stars) {
              two.isWinner = true;
            }

            this.setState({
              repos: collection,
            });
          });
        return console.log('here', repos, this.state);
      });
    }
  }

  render () {
    const errors = this.state.errors;
    return (
      <div className="battle-zone">
        {errors ? (<h1>{errors}</h1>) : (null)}
        <div className="battle-zone__form">
          <div className="repo-section__wrapper">
            <RepoView
              repo={this.state.repos[0]}
              onChange={this.handleChange.bind(this)}
            />
            <RepoView
              repo={this.state.repos[1]}
              onChange={this.handleChange.bind(this)}
            />
          </div>
        </div>
        <AnnounceWinner repos={this.state.repos} />

        <button type="submit" className="battle-zone__submit" onClick={this.handleSubmit.bind(this)}>Let&rsquo;s do battle</button>
      </div>
    );
  }
}

export default BattleZone;
