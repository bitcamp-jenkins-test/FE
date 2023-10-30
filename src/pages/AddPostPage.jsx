import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { BsCameraFill } from 'react-icons/bs';
import { AiOutlineLeft } from 'react-icons/ai';
import { RiDeleteBack2Fill } from 'react-icons/ri';

import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ROUTER from '../constants/router';
import Valid from '../validation/validation';
import Axios from '../utils/api/axios';
import QUERY from '../constants/query';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useNavigate } from "react-router-dom";

const axios = new Axios(QUERY.AXIOS_PATH.SEVER);


export default function AddPostPage({ children, detail }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [preview, setPreview] = useState([]);
  const [formData, setFormData] = useState([]);
  const [post, setPost] = useState();
  const dealingType = useRef();
  const category = useRef();


  const location = useLocation();
  if (location.state != undefined || location.state != null) {
    const postDetail = location.state.detail;
    if (post == undefined) {
      setPost(postDetail);
    }
  }


  useEffect(() => {
    if (post != undefined) {
      setTitle(post.title);
      setContent(post.content);
      setPrice(post.price);
      setAddress(post.address);
      dealingType.current.value = post.dealingType;
      //setImage(postDetail.imageUrlList);
      setPreview(post.attachedFilesPaths);
      category.current.value = post.itemCategory;
    }

  }, [post])

  // useEffect(() => {
  //   console.log(preview);
  // }, [preview])

  const handleSubmit = event => {
    event.preventDefault();

    if (
      !Valid.emptyPostAddCheck(
        image,
        preview,
        title,
        content,
        price,
        dealingType.current.value
      )
    )
      return;
    console.log("정상적으로 완료 필터 통과");
    const formData = new FormData();
    let myPost = {};
    let imageData = [];
    let contentKey = '';
    let parsePrice = price;
      if (dealingType.current.value === 'FOR_FREE') {
          parsePrice = '0';
      } else  {
          parsePrice = price.replace(/[^\d]/g, ''); // 숫자가 아닌 문자를 모두 제거
      }


    console.log(post);
    if (post) {
      console.log("업데이트는 여기로타야함");
      const parsePreviewData = preview.filter(v => v[0] === 'h');
      //imageData = image.filter(v => v.name);
      console.log(preview);
      contentKey = 'postUpdateRequestDto';
      imageData = image;
      myPost = {
        title,
        content,
        price: parsePrice,
        dealingType: dealingType.current.value,
        itemCategory: category.current.value,
        attachedFiles: preview,
        address,
      };
    } else {
      console.log("추가는 여기로타야함");

      imageData = image;
      contentKey = 'postRequestDto';
      myPost = {
        title,
        content,
        price: parsePrice,
        dealingType: dealingType.current.value,
        itemCategory: category.current.value,
        address,
      };

    }

    formData.append(
      contentKey,
      new Blob([JSON.stringify(myPost)], { type: 'application/json' })
    );

    imageData &&
      imageData.forEach(multipartFiles =>
        formData.append('multipartFiles', multipartFiles)
      );
    if (contentKey == 'postRequestDto') {
      axios.post(QUERY.AXIOS_PATH.ADDPOST, formData)
        .then(() => {
          navigate(ROUTER.PATH.MAIN);
        })
        .catch((error) => {
          if (error.response.status == 401) {
            navigate(ROUTER.PATH.MAIN);
          }
        });
    } else {
      axios.put(QUERY.AXIOS_PATH.ADDPOST + "/" + post.postId, formData)
        .then(() => {
          navigate(ROUTER.PATH.MAIN);
        })
        .catch((error) => {
          if (error.response.status == 401) {
            navigate(ROUTER.PATH.MAIN);
          }
        });
    }


  };

  const handleImageChange = event => {
    const files = event.target.files;
    const urlList = [...files].map(url => URL.createObjectURL(url));
    setImage([...image].concat(...files));
    setImageUrl([...imageUrl].concat(urlList));
  };

  const handleDeleteImg = index => {
    setImage([...image].filter((_, i) => i !== index));
    setImageUrl([...imageUrl].filter((_, i) => i !== index));
  };

  const handleDeletePrevImg = index => {
    setPreview([...preview].filter((i) => i.id !== index));
  };

  const handlePrice = e => {
    let number = e.target.value;
    number = Number(number.replace(/[,]/g, ''));
    if (Number.isNaN(Number(number))) return;
    setPrice(number.toLocaleString('ko-KR'));
  };

  const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

    setAddress(fullAddress);
  };
  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Form onSubmit={handleSubmit} encType='multipart/form-data'>
      <FormBorder>
        <FormHeader>
          <FormTitle>
            <Link to={ROUTER.PATH.BACK}>
              <AiOutlineLeft />
            </Link>
            <FormTitleText>{children}</FormTitleText>
          </FormTitle>
          <FormButton type='submit'>완료 </FormButton>
        </FormHeader>
        <InputCategory ref={category} as='select'>
          <option value='DIGITAL'>디지털 기기</option>
          <option value='FURNITURE_INTERIOR'>가구/인테리어</option>
          <option value='CLOTHING'>의류</option>
          <option value='APPLIANCES'>생활가전</option>
          <option value='KITCHENWARE'>생활/주방</option>
          <option value='SPORTS_LEISURE'>스포츠/레저</option>
          <option value='CAR_TOOLS'>자동차/공구</option>
          <option value='BOOK'>도서</option>
          <option value='BEAUTY_COSMETIC'>뷰티/미용</option>
          <option value='PET'>반려동물용품</option>
          <option value='ETC'>기타</option>
        </InputCategory>
        <InputDealingType ref={dealingType} as='select'>
          <option value='WITHPERSONAL'>직접거래</option>
          <option value='FOR_PAY'>안전결제</option>
          <option value='FOR_FREE'>나눔</option>
        </InputDealingType>
        <LableBorder preview={preview.length !== 0 ? true : false}>
          {preview.length !== 0 &&
            preview.map((element) => (
              <ImgConatiner key={element.id}>
                <Delete onClick={() => handleDeletePrevImg(element.id)}>
                  <RiDeleteBack2Fill />
                </Delete>
                <PrevImg src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${element.filePath}?type=f&w=250&h=250`} alt='preview' />
              </ImgConatiner>
            ))}
          {imageUrl.length !== 0 &&
            imageUrl.map((url, index) => (
              <ImgConatiner key={uuidv4()}>
                <Delete onClick={() => handleDeleteImg(index)}>
                  <RiDeleteBack2Fill />
                </Delete>
                <Img srcImg={url} alt='preview' />
              </ImgConatiner>
            ))}
          <Label htmlFor='file-upload'>
            <CameraIcon>
              <BsCameraFill />
            </CameraIcon>
            <Input
              id='file-upload'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              multiple
            />
          </Label>
        </LableBorder>
        <InputText
          type='text'
          value={price}
          onChange={e => handlePrice(e)}
          placeholder='가격'
        />
        <InputText
          type="text"
          id="areaAddress"
          value={address}
          readOnly
          //onChange={e => setAddress(e.target.value)}
          placeholder='주소'
          onClick={handleClick}
        />

        <InputText
          type='text'
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='제목'
        />
        <TextArea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder='내용'
        />
      </FormBorder>
    </Form>
  );
}

const Form = styled.form`
  width: 40rem;
  height: 90%;
  margin: 0 auto;
  border: 1px solid #dbdbdb;
  border-radius: 1rem;
`;

const FormBorder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

const LableBorder = styled.div`
  display: flex;
  justify-content: ${props => (props.preview ? 'flex-start' : 'center')};
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 5rem 1rem;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  gap: 1rem;
  overflow: scroll hidden;
`;

const ImgConatiner = styled.div`
  position: relative;
  width: 15rem;
`;

const Img = styled.div`
  height: 15rem;
  width: 15rem;
  padding-bottom: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
  background-image: url(${props => props.srcImg});
  background-size: 100% 100%;
`;

const PrevImg = styled.img`
  height: 15rem;
  width: 15rem;
  //padding-bottom: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
  //background-image: url(${props => props.srcImg});
  background-size: 100% 100%;
`;

const Delete = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.color.carrot_orange};
  z-index: 1000;
  transition: all 300ms ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
`;

const FormTitleText = styled.span`
  margin-left: 10px;
`;

const Label = styled.label`
  color: black;
  cursor: pointer;

  svg {
    font-size: 5rem;
  }
`;

const CameraIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15rem;
  height: 15rem;
  border: 1px solid black;
  border-radius: 1rem;
`;

const Input = styled.input`
  display: none;
`;

const FormButton = styled.button`
  width: 80px;
  height: 30px;
  font-size: 16px;
  border: none;
  background-color: transparent;
  color: orange;
  font-weight: bold;
`;

const InputText = styled.input`
  width: 100%;
  height: 3rem;
  margin-bottom: 10px;
  border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  ::placeholder {
    color: #ccc;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  resize: none;
  ::placeholder {
    color: #ccc;
  }
`;

const InputDealingType = styled.input`
  width: 100%;
  height: 3rem;
  margin-bottom: 10px;
  border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 8px;
  font-size: 1rem;
  border-radius: 5px;
`;
const InputCategory = styled.input`
  width: 100%;
  height: 3rem;
  margin-bottom: 10px;
  border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 8px;
  font-size: 1rem;
  border-radius: 5px;
`;

