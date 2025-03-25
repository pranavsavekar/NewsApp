import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useActionData } from "react-router-dom";

export const News = (props) =>{
  const [articles, setArticles] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [page, setPage] = useState(1)  
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  const updateNews = async() => {
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=80927ba243aa4a5a832651595855f1c0&page=${page}&pagesize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(40);
    let parsedData = await data.json();
    props.setProgress(80);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)

    props.setProgress(100);
  }

  useEffect(() => {
   document.title = `${capitalizeFirstLetter(props.category)} - DailyScope`;
   updateNews();
  }, [])

 const handlePrevClick = async () => {
    setPage(page-1)
    updateNews();
  };

  const handleNextClick = async () => {
      setPage(page+1)
      updateNews();
  };

  const fetchMoreData = async () => {
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=80927ba243aa4a5a832651595855f1c0&page=${page+1}&pagesize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

    return (
      <>
        <h2 className="text-center" style={{ margin: "35px 0px", marginTop: '90px' }}>
          DailyScope - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h2>
        {loading && <Spinner/>}
        <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length!==totalResults}
            loader={<Spinner/>}
          >
            <div className="container">
          <div className="row">
              {articles.map((element,index) => {
                return (
                  <div className="col-md-4" key={element.url || index}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={element.description ? element.description : ""}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
          </div>
          </div>
        </InfiniteScroll>
        </>
    );
}

News.defaultProps = {
  pageSize: 9,
  country: "us",
  category: "general",
};

News.propTypes = {
  pageSize: PropTypes.number,
  country: PropTypes.string,
  category: PropTypes.string,
};

// export default News;
