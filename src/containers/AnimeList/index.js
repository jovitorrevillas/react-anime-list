import { Fragment } from 'react';
import Card from 'containers/Card';
import styles from './AnimeList.module.css';
import InfiniteScroll from "react-infinite-scroll-component";

const AnimeList = ({ list, results, clickIcon, fetchData }) => {
  return (
    <InfiniteScroll
      className={styles.Wrapper}
      dataLength={list.length}
      next={fetchData}
      hasMore={list.length < results}
      loader={<h4>Loading...</h4>}
    >
      {list.map((el, index) => {
        const cover = el.attributes.posterImage;
        let title = el.attributes.canonicalTitle;
        if (el.attributes.titles) {
          title = el.attributes.titles.en || title;
        }
        return (
          <Fragment key={title + index}>
            <Card
              index={index}
              imageURL={cover && (cover.large || cover.original)}
              name={title}
              favorites={el.attributes.favoritesCount}
              clickIcon={clickIcon}
              rating={el.attributes.averageRating}
              favorite={el.favorite}
              rate={el.rate}
            />
          </Fragment>
        );
      })}
    </InfiniteScroll>
  );
}

export default AnimeList;