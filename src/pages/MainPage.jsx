import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import { useNavigate } from 'react-router-dom';

//const axios = new Axios(QUERY.AXIOS_PATH.SEVER);



export default function MainPage() {
  const [target, setTarget] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [pageNo, setpageNo] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stop, setStop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmptyPost, setIsEmptyPost] = useState(false);
  const [word, setWord] = useState(null);
  //const [location, setLocation] = useState(null);
  const [categoryMap, setCategoryMap] = useState(new Map());

  const location = useLocation();


  async function fetchPosts(page, isStop) {
    if (!isStop) {
      try {
        //console.log("서버 요청하기전 데이터값  " + pageNo + "   " + selectedCategory)
        const response = await axios.get(`${QUERY.AXIOS_PATH.SEVER}${QUERY.AXIOS_PATH.POSTLIST}?pageNo=${page}&category=${selectedCategory == null ? "TOTAL" : selectedCategory}&word=${word ? word : ""}`);

        posts.concat(response.data.result);
        // console.log("데이터확인중 ----------------------------");
        // console.log(response.data.result);
        if (response.data.result) {
          setIsEmptyPost(false);
          if (response.data.result.length < 8) {
            setStop(true);
          }
          setPosts((posts) => posts.concat(response.data.result));

        } else {
          setIsEmptyPost(true);
        }

      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          navigate(ROUTER.PATH.MAIN);
          return;
        }
        console.error('Error fetching posts:', error);
      }
    }
  }



  //--------------------무한스크롤링 세팅
  //  1. 감시에 들어올 시, 로딩 true로 설정
  //  2. 로딩 true 설정시, page 를 + 1한다.
  //  3. page 설정시, 서버에 요청해서 값 업데이트를 한다.
  //  4. posts 업데이트시, 다시 로딩을 false로 설정한다.


  useEffect(() => {
    //console.log("페이지 숫자 업데이트  " + pageNo)
    if (pageNo > 0) {
      fetchPosts(pageNo, stop);
    }
  }, [pageNo]);

  useEffect(() => {
    console.log("새로고침진행했습니다")
  }, []);


  const callback = () => {
    if (!stop) {
      //console.log("감시했음   " + pageNo);
      setpageNo((prevPageNo) => prevPageNo + 1);
    }
  };

  useEffect(() => {
    // console.log("카테고리 갱신시 요구되는값 :  false   null   0아님   false");
    // console.log("카테고리 갱신 " + stop + "  " + posts + "  " + pageNo + "  " + loading);
    // console.log(selectedCategory)
    setStop((prevStop) => prevStop ? false : false);
    setPosts((posts) => []);
    if (pageNo != 1) {
      setpageNo((prevPageNo) => prevPageNo - prevPageNo + 1);
    } else {
      fetchPosts(1, false);
    }



  }, [selectedCategory]);

  //-------------------------------------------------

  // Map 객체에 데이터 추가하는 함수



  useEffect(() => {

    if (location.state) {
      console.log(wordContainsCategory(location.state.word))
      console.log(categoryMap)
      if (wordContainsCategory(location.state.word)) {
        setWord(null);
        setSelectedCategory(categoryMap.get(location.state.word));
      } else {
        console.log(location.state.word);
        setWord(location.state.word);
        setSelectedCategory(location.state.word);
      }

    }


  }, [location.state])

  useEffect(() => {

    let observer;
    if (target) {
      //console.log("무한스크롤 세팅");
      observer = new IntersectionObserver(callback);
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };


  const showAllPosts = () => {
    setSelectedCategory('TOTAL');
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'DIGITAL':
        return '디지털 기기';
      case 'FURNITURE_INTERIOR':
        return '가구/인테리어';
      case 'CLOTHING':
        return '의류';
      case 'APPLIANCES':
        return '생활가전';
      case 'KITCHENWARE':
        return '생활/주방';
      case 'SPORTS_LEISURE':
        return '스포츠/레저';
      case 'CAR_TOOLS':
        return '자동차/공구';
      case 'BOOK':
        return '도서';
      case 'BEAUTY_COSMETIC':
        return '뷰티/미용';
      case 'PET':
        return '반려동물용품';
      case 'ETC':
        return '기타';
      default:
        return '전체 카테고리';
    }
  };
  //console.log(categoryMap.size);
  if (categoryMap.size == 0) {
    categoryMap.set('디지털 기기', 'DIGITAL');
    categoryMap.set('가구/인테리어', 'FURNITURE_INTERIOR');
    categoryMap.set('의류', 'CLOTHING');
    categoryMap.set('생활가전', 'APPLIANCES');
    categoryMap.set('생활/주방', 'KITCHENWARE');
    categoryMap.set('스포츠/레저', 'SPORTS_LEISURE');
    categoryMap.set('자동차/공구', 'CAR_TOOLS');
    categoryMap.set('도서', 'BOOK');
    categoryMap.set('뷰티/미용', 'BEAUTY_COSMETIC');
    categoryMap.set('반려동물용품', 'PET');
    categoryMap.set('기타', 'ETC');
    categoryMap.set('전체 게시글', 'TOTAL');
  }
  const wordContainsCategory = (myWord) => {
    switch (myWord) {
      case '디지털 기기':
        return true;
      case '가구/인테리어':
        return true;
      case '의류':
        return true;
      case '생활가전':
        return true;
      case '생활/주방':
        return true;
      case '스포츠/레저':
        return true;
      case '자동차/공구':
        return true;
      case '도서':
        return true;
      case '뷰티/미용':
        return true;
      case '반려동물용품':
        return true;
      case '기타':
        return true;
      default:
        return false;
    }
  };
  const changeCategory = (change) => {
    setWord(null);
    setSelectedCategory(change);
  }


  // 게시글 등록시 카테고리선택이 구현이 되면 setSelectedCategory에 카테고리 명을 적으면 됩니다

  return (
    <MainWrapper>
      <CategoryTitle>{getCategoryTitle()}</CategoryTitle>
      <div>
        <CategoryButton onClick={showAllPosts}>전체 게시글</CategoryButton>
        <CategoryButton onClick={() => changeCategory('DIGITAL')}>디지털 기기</CategoryButton>
        <CategoryButton onClick={() => changeCategory('FURNITURE_INTERIOR')}>가구/인테리어</CategoryButton>
        <CategoryButton onClick={() => changeCategory('CLOTHING')}>의류</CategoryButton>
        <CategoryButton onClick={() => changeCategory('APPLIANCES')}>생활가전</CategoryButton>
        <CategoryButton onClick={() => changeCategory('KITCHENWARE')}>생활/주방</CategoryButton>
      </div>
      <CategoryButtonRow>
        <div>
          <CategoryButton onClick={() => changeCategory('SPORTS_LEISURE')}>스포츠/레저</CategoryButton>
          <CategoryButton onClick={() => changeCategory('CAR_TOOLS')}>자동차/공구</CategoryButton>
          <CategoryButton onClick={() => changeCategory('BOOK')}>도서</CategoryButton>
          <CategoryButton onClick={() => changeCategory('BEAUTY_COSMETIC')}>뷰티/미용</CategoryButton>
          <CategoryButton onClick={() => changeCategory('PET')}>반려동물용품</CategoryButton>
          <CategoryButton onClick={() => changeCategory('ETC')}>기타</CategoryButton>
        </div>
      </CategoryButtonRow>
      <Container>
        {posts.length === 0 ? (
          <p>조건에 만족하는 게시물이 존재하지 않습니다.</p>
        ) : (
          <Row>
            {posts.map((post) => (
              <div key={post.postid}>
                <Link to={`/post/${post.postid}`}>
                  <Card>
                    <CardImg
                      src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${post.attachedFilesPaths[0].filePath}?type=f&w=250&h=250`}
                      alt={'게시글 이미지'}
                      className="card-img-top"
                    />
                    <CardBody>
                      <CardTitle>{post.title}</CardTitle>
                      <CardText><strong>{formatPrice(post.price)}원</strong></CardText>
                      <DealingTypeBadge dealingType={post.dealingType}>
                        {post.dealingType === 'FOR_PAY' ? '안전결제' : (
                          post.dealingType === 'WITHPERSONAL' ? '직접결제' : (
                            post.dealingType === 'FOR_FREE' ? '나눔' : ''
                          )
                        )}
                      </DealingTypeBadge>
                    </CardBody>
                  </Card>

                </Link>
              </div>
            ))
            }

          </Row >
        )}
        <div ref={setTarget}>
        </div>
      </Container >
    </MainWrapper >
  );
}

const MainWrapper = styled.main`
  width: 100%;
  height: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto; 
`;

const CategoryTitle = styled.h1`
  margin-top: 30px;
  color: #333;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
`;

const CategoryButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const CategoryButton = styled.button`
  width: 7rem;
  font-size: 13px;
  padding: 10px;
  background-color: #ff922b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  &:hover {
    background-color: #ffad6d;
  }
`;

const Container = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 20px;
  border-radius: 5%;
`;

const CardImg = styled.img`
  width: 100%;
  border-radius: 5%
`;

const CardBody = styled.div`
  padding: 10px;
`;

const CardTitle = styled.div`
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;


const CardText = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 230px);
  justify-content: center;
  grid-gap: 30px; 
`;

const DealingTypeBadge = styled.div`
background-color: ${({ dealingType }) => {
    if (dealingType === 'FOR_PAY') return '#00cc00';
    if (dealingType === 'WITHPERSONAL') return '#4A90E2';
    if (dealingType === 'FOR_FREE') return '#ff922b';
    return '#999';
  }};
color: #fff;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
`;
