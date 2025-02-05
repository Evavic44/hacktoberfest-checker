// Libraries
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// Components
import TimeMessage from './TimeMessage';
import UsernameInput from './UsernameInput';
import CheckButton from './CheckButton';

const getUserUrl = (username) => `/user/${username}`;

export default function UsernameForm(props) {
  const [username, setUsername] = useState(props.username);
  const history = useHistory();

  const handleUsernameChange = useCallback(
    (e) => setUsername(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (username.trim().length === 0) {
        return;
      }

      const userUrl = getUserUrl(username);
      history.push(userUrl);
    },
    [username, history]
  );

  return (
    <div className="pb-4 md:pt-16">
      <TimeMessage />
      <form
        action="/"
        className="flex h-12 mx-auto w-5/6 md:w-3/5 lg:w-1/3"
        method="get"
        onSubmit={handleSubmit}
      >
        <UsernameInput value={username} onChange={handleUsernameChange} />
        <CheckButton />
      </form>
    </div>
  );
}

UsernameForm.propTypes = {
  username: PropTypes.string,
};

UsernameForm.defaultProps = {
  username: '',
};
