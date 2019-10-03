import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(context: any) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name="google" content="notranslate"></meta>
          <meta charSet='utf-8' />
          <title>Skyace™ | Learning On The Go</title>
          <link rel='stylesheet' href='/_next/static/style.css' />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon.png" />
          <link href='https://fonts.googleapis.com/css?family=Raleway:300,600,900|Open+Sans:300,400,800,600' rel='stylesheet' type='text/css'/>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;