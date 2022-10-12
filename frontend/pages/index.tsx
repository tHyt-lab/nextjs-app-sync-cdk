import type { NextPage } from 'next';
import Head from 'next/head';
import { Home } from '../components/Home';

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Todo App - frontend</title>
      </Head>
      <main>
        <Home />
      </main>
    </div>
  );
};

export default HomePage;
