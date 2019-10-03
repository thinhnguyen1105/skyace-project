import * as React from 'react';
import Error from 'next/error';

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="error-page">
        <Error statusCode={404} />
      </div>
    );
  }
}

export default ErrorPage;