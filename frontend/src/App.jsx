import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClone } from '@fortawesome/free-solid-svg-icons';

import AppContext from './AppContext';
import LoginModal from './LoginModal';
import Feed from './Feed';
import CreateRecipe from './CreateRecipe';

function App() {
  const [profile, setProfile] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const [recipeFeed, setRecipeFeed] = useState([]);
  const [authVisible, setAuthVisible] = useState(false);
  const [recipeVisible, setRecipeVisible] = useState(false);

  async function logout() {
    const req = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();
    setProfile(res.success ? {} : profile);
  }

  async function fetchRecipes() {
    const { user, tags, search } = feedFilter;

    const req = await fetch(`/api/recipe?${user ? `user=${user}` : ''}${(tags || []).length ? `tags=${tags.join()}` : ''}${search ? `search=${search}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();

    setRecipeFeed(res.recipes || []);
  }

  useEffect(async () => {
    const req = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();
    setProfile(res.user || {});
    fetchRecipes();
  }, []);

  const profileHeader = profile.username ? (
    <div className="has-text-centered">
      <div className="columns is-flex is-centered">
        <figure className="image is-128x128">
          <img className="is-rounded" alt="profile" src="https://bulma.io/images/placeholders/128x128.png" />
        </figure>
      </div>
      <p className="menu-label">
        {profile.fullName}
      </p>
      <p className="menu-label">
        @
        {profile.username}
      </p>
      <nav className="level">
        <div className="level-item">
          <div>
            <p className="heading">Posts</p>
            <p className="subtitle">3,456</p>
          </div>
        </div>
        <div className="level-item">
          <div>
            <p className="heading">Following</p>
            <p className="subtitle">123</p>
          </div>
        </div>
        <div className="level-item">
          <div>
            <p className="heading">Followers</p>
            <p className="subtitle">456K</p>
          </div>
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <AppContext.Provider value={{
      profile,
      setProfile,
      setFeedFilter,
      recipeFeed,
      authVisible,
      setAuthVisible,
      recipeVisible,
      setRecipeVisible,
    }}
    >
      <nav className="navbar is-spaced" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            CookUp!
          </a>

          <a role="button" href="#" className="navbar-burger" aria-label="menu" onClick={() => { setMobileMenu(!mobileMenu); }} aria-expanded={mobileMenu}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className="container is-max-desktop">
          <div className={`navbar-menu ${mobileMenu ? 'is-active' : ''}`}>
            <div className="navbar-start is-hidden-tablet">
              {profileHeader}
              <a className="navbar-item">Home</a>
              <a className="navbar-item">Collection</a>
              <div className="navbar-item has-dropdown">
                <a className="navbar-link">Trending</a>
                <div className="navbar-dropdown">
                  <a className="navbar-item">#Vegan</a>
                  <a className="navbar-item">#PlantBased</a>
                  <a className="navbar-item">#GluttenFree</a>
                  <a className="navbar-item">#ZuccFries</a>
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item is-expanded">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input onChange={(event) => { setFeedFilter({ search: event.target.value }); }} className="input" type="text" placeholder="What's Cookin?" />
                  </div>
                  <div className="control">
                    <a role="button" href="#" className="button" onClick={() => { fetchRecipes(); }}>CookUp!</a>
                  </div>
                </div>
              </div>
              {profile.username ? (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-primary is-fullwidth" onClick={() => { setRecipeVisible(true); }}>
                      Create Recipe
                    </a>
                  </div>
                </div>
              ) : null}
              { profile.username ? (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-danger is-fullwidth" onClick={() => { logout(); }}>Log out</a>
                  </div>
                </div>
              ) : (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-primary is-fullwidth" onClick={() => { setAuthVisible(true); }}>Sign Up</a>
                  </div>
                </div>
              ) }
            </div>
          </div>
        </div>
      </nav>
      <section className="container is-fullheight is-fluid">
        <div className="columns">
          {/* Start of sidebar  */}
          <aside className="column is-3-desktop is-4-tablet menu is-fullheight section is-hidden-mobile">
            {profileHeader}
            <hr className="navbar-divider" />
            <ul className="menu-list">
              <li>
                <a className="is-active">
                  <span className="icon">
                    <FontAwesomeIcon icon={faHome} />
                  </span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="icon">
                    <FontAwesomeIcon icon={faClone} />
                  </span>
                  <span>Collection</span>
                </a>
              </li>
            </ul>
            <p className="menu-label">Trending</p>
            <ul className="menu-list">
              <li><a>#Vegan</a></li>
              <li><a>#PlantBased</a></li>
              <li><a>#GlutenFree</a></li>
              <li><a>#ZuccFries</a></li>
            </ul>
            <hr className="navbar-divider" />
          </aside>
          {/* End of sidebar */}
          <div className="column">
            {/* Content goes here */}
            <div className="container is-max-desktop">
              <Feed />
            </div>
            <br />
          </div>
        </div>
      </section>
      <CreateRecipe />
      <LoginModal />
    </AppContext.Provider>
  );
}

export default App;
