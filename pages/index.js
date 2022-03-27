import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getPosts } from "../api/GhostAPI";

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export async function getStaticProps(context) {
  const fetchedNews = {
    filter: "tag:" + process.env.NEXT_PUBLIC_TAG_NEWS,
    include: "date,excerpt",
    limit: "all",
  };

  let data = await getPosts(fetchedNews);
  // console.log(data);

  return {
    props: {
      posts: data,
    },
    revalidate: 1,
  };
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <ul>
            {props.posts.map((post) => (
              <li>
                {post.title}
                <img src={post.feature_image} width="231" height="126" />
                {/* <Image
                  loader={myLoader}
                  alt={post.title}
                  src={
                    post.feature_image
                      ? post.feature_image
                      : "/images/rectangle3.jpg"
                  }
                  width="231"
                  height="126"
                /> */}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
