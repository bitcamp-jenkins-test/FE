import React from "react";
import { useEffect, useState } from "react";
//import { useDispatch } from "react-redux";
import Storage from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import ROUTER from '../constants/router';
import Axios from '../utils/api/axios';
import QUERY from "../constants/query";

import axios from 'axios';

const axiosForLoginUser = new Axios(QUERY.AXIOS_PATH.SEVER);

const Payment = () => {
  const navigator = useNavigate();
  const chargePoint = Storage.getAmount();
  console.log("코드번호 : " + process.env.REACT_APP_IMP)
  console.log("충전금액 : " + chargePoint);
  useEffect(() => {
    requestPay();
    return () => {

    };
  }, []);

  const requestPay = () => {
    if (parseInt(chargePoint) < 1000) {
      alert("1000원 이상부터 충전 가능합니다");
      navigator(ROUTER.PATH.BACK);
      return;
    }
    console.log("결제서비스 하기전에, 해당 유저가 로그인 했는지 확인하는 과정");
    const res = [];
    const response = axiosForLoginUser.get(`/api/profiles`)
      .then((response) => {
        console.log(response.data.result);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigator(ROUTER.PATH.LOGIN)
        }
        console.error('Error fetching old messages:', error);
      });
    const { IMP } = window;
    IMP.init(`${process.env.REACT_APP_IMP}`);

    IMP.request_pay({
      pg: 'kakaopay.TC0ONETIME',
      pay_method: 'card',
      merchant_uid: new Date().getTime(),
      name: '캐롯선더충전',
      amount: chargePoint,
      buyer_email: 'test@test.com',
      buyer_name: '코드쿡',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시',
      buyer_postcode: '123-456',
    }, async (rsp) => {
      try {
        // console.log(rsp.paid_amount);
        // console.log(chargePoint);
        //TODO  : 결제완료후, 해당 결제 정보사항 DB에 저장하고, 현재 사용자 포인트 정보 업데이트 해야함
        const userId = Storage.getUserId();
        console.log("userId : " + userId);
        console.log(rsp);
        if (!rsp.success) {
          alert('결제 실패');
          navigator(ROUTER.PATH.MYPAGE);
          return;
        }
        const { data } = await axios.post('http://localhost:8888/api/payments'
          , { userId, chargePoint });
        console.log(data);
        Storage.setPoint(data);
        alert('결제 성공');
        Storage.removeAmount();
        navigator(ROUTER.PATH.MYPAGE);
      } catch (error) {
        console.error('Error while verifying payment:', error);
        alert('결제 실패');
        navigator(ROUTER.PATH.MYPAGE);
      }



    });
  };
};

export default Payment;