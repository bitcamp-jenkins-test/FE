import React, { Component } from 'react';

class MapComponent extends Component {
  componentDidMount() {
    this.loadNaverMapsScript()
  }

  checkNaverAvailability = () => {
    if (!(window.naver == undefined) && !(window.naver.maps.Service == undefined)) {
      this.initMap(); // 이미 로드되어 있다면 초기화
    } else {
      setTimeout(this.checkNaverAvailability, 200); // 200ms 마다 확인

    }
  }

  loadNaverMapsScript() {
    const script = document.createElement('script');
    const naverMapKey = process.env.REACT_APP_NCP_API_KEY;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapKey}`;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapKey}&submodules=geocoder`;
    script.onload = () => {
      this.checkNaverAvailability(); // 스크립트 로드 완료 후 확인 시작
    };
    document.head.appendChild(script);
  }

  initMap() {
    console.log(window.naver);
    var navermaps = window.naver.maps;
    // 주소를 가져온다.
    var { address } = this.props;
    console.log(navermaps);
    console.log(navermaps.Service);
    navermaps.Service.geocode({ query: address }, (status, response) => {
      if (status === navermaps.Service.Status.ERROR) {
        return alert('Something wrong!');
      }

      const result = response.v2; // 검색 결과의 컨테이너
      const items = result.addresses; // 검색 결과의 배열

      if (items.length > 0) {
        const coordinates = {
          x: items[0].x,
          y: items[0].y,
        };
        // 좌표 뜨는지 확인
        // alert('좌표: ' + coordinates.x + ', ' + coordinates.y); 

        // 지도 설정
        const mapOptions = {
          center: new navermaps.LatLng(coordinates.y, coordinates.x),
          zoom: 17,
        };

        var map = new navermaps.Map('map', mapOptions);

        // 좌표를 사용하여 마커 생성
        var marker = new navermaps.Marker({
          position: new navermaps.LatLng(coordinates.y, coordinates.x),
          map: map,
        });

      } else {
        alert('주소를 좌표로 변환할 수 없습니다.');
      }

    });
  }

  render() {
    return <div id="map" style={{ width: '400px', height: '300px' }}></div>;
  }
}

export default MapComponent;