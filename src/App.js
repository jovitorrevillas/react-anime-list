import { useState, useEffect, useRef } from 'react';
import kitsuApi from 'api/kitsu.io';
import Header from 'containers/Header';
import AnimeList from 'containers/AnimeList';
import styles from './App.module.css';
import ClickableIcon from 'components/ClickableIcon';
import SolidHeart from 'images/SolidHeart';
import SolidStar from 'images/SolidStar';
import MagnifyingGlass from 'images/MagnifyingGlass';

function App() {
  const ref = useRef(null);
  const appRef = useRef(null);
  const [searchAnime, setsearchAnime] = useState('');
  const [results, setResult] = useState(0);
  const [allResults, setAllResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(0);
  const [animeList, setAnimeList] = useState([]);
  const [allAnimeList, setAllAnimeList] = useState([]);
  const [filterFaved, setFilterFaved] = useState(false);
  const [filterRated, setFilterRated] = useState(false);

  const fetchAnimeList = async (fetchNew = false) => {
    setLoading(true);

    if (ref.current) {
      ref.current.focus();
    }

    let obj = {};
    if (searchAnime !== '') {
      obj['filter[text]'] = encodeURI(searchAnime);
    }
    const { data } = await kitsuApi.get('/anime', {
      params: {
        ...obj,
        'page[limit]': 16,
        'page[offset]': fetchNew ? 0 : pageLoaded,
        'fields[anime]': 'startDate,canonicalTitle,favoritesCount,averageRating,titles,posterImage',
      }
    });

    if (data.links.next) {
      setPageLoaded(data.links.next.split('=').pop());
    }

    setResult(data.meta.count);
    setAllResults(data.meta.count);

    if (fetchNew) {
      setAnimeList([...data.data]);
      setAllAnimeList([...data.data]);
    } else {
      setAnimeList([...animeList, ...data.data]);
      setAllAnimeList([...animeList, ...data.data]);
    }
    setLoading(false);
  };

  const onClickIcon = (index, func = 'favorite') => {
    const arr = [...animeList];
    arr[index] = {
      ...arr[index],
      [func]: arr[index][func] ? false : true,
    }
    const arrTwo = [...allAnimeList].map(el => {
      if (arr[index].id === el.id) {
        return { ...el, [func]: el[func] ? false : true }
      }
      return el;
    });
    setAnimeList([...arr]);
    setAllAnimeList([...arrTwo]);
  }

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      fetchAnimeList(true);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const { data } = await kitsuApi.get('/anime', {
        params: {
          'filter[text]': encodeURI('alchemist'),
          'page[limit]': 12,
          'page[offset]': 0,
          'fields[anime]': 'startDate,canonicalTitle,favoritesCount,averageRating,titles,posterImage',
        }
      });
      setAnimeList([...data.data]);
      setAllAnimeList([...data.data]);
      setResult(12);
      setAllResults(12);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let arr = [...allAnimeList];

    if (filterFaved) {
      arr = [...arr.filter(el => el.favorite)]
      setResult(arr.length)
    }

    if (filterRated) {
      arr = [...arr.filter(el => el.rate)]
      setResult(arr.length)
    }

    setAnimeList(arr);
    if (!filterFaved && !filterRated) {
      setResult(allResults);
    }
  }, [filterFaved, filterRated, allAnimeList, allResults])


  return (
    <div ref={appRef} className={styles.App}>
      <div className={styles.Wrapper}>
        <Header />
        <div className={styles.UserInteraction}>
          <div className={styles.FilterWrapper}>
            <span style={{ marginRight: '.5em' }}>Filter</span>
            <ClickableIcon
              Icon={SolidStar}
              isSelected={filterRated}
              selectColor="yellow"
              innerProps={{
                stroke: "black",
                strokeWidth: "2em"
              }}
              runFunction={() => {
                setFilterRated(!filterRated);
              }} />
            <ClickableIcon
              Icon={SolidHeart}
              isSelected={filterFaved}
              selectColor="red"
              innerProps={{
                stroke: "black",
                strokeWidth: "2em",
                width: "2em"
              }}
              runFunction={() => {
                setFilterFaved(!filterFaved);
              }} />

          </div>
          <div className={styles.SearchWrapper}>
            <MagnifyingGlass className={styles.SearchIcon} height="1em" width="1em" onClick={() => fetchAnimeList(true)} />
            <input ref={ref} className={styles.SearchBox} disabled={loading} value={searchAnime} onKeyDown={keyPress} onChange={(e) => setsearchAnime(e.target.value)} />
          </div>
          <div style={{ width: 100 }}>{results} Results</div>
        </div>
        <AnimeList results={results} fetchData={fetchAnimeList} list={animeList} clickIcon={onClickIcon} />
      </div>
    </div>
  );
}

export default App;
