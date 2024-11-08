import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./AdminStyle.module.css";
import {
  faUser,
  faUserGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUserInfo, useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import AdminUserDetail from "./AdminUserDetail";
import AdminUserAdminModal from "./AdminUserAdminModal";
import AdminScheduleModal from "./AdminSchedulemodal";
import shortid from "shortid";
import Paginatation from "../layoutComponents/Paginatation";
import { useSubscribeStore } from "@/store/subscribe";
import { getKnitSubscribeDataList } from "@/utils/utils";
import { mailPost } from "@/apis/mail";

// 페이지당 보여줄 사용자 수
const numShowContents = 3;

const AdminUser = () => {
  const { userInfo } = useUserInfo(); // 현재 로그인된 사용자 정보 가져오기
  const { userList, userDetailInfo, getUserInfo, reviseUserInfo, getUserSubscribeInfo } = useUserStore(); // 사용자 리스트와 상세정보 가져오기
  const { subscribeList } = useSubscribeStore(); // 구독 상품 리스트 가져오기

  // 페이지 상태와 페이지네이션 관련 상태들
  const [modal, setModal] = useState(false); // 사용자 상세 정보 모달 상태
  const [adminModal, setAdminModal] = useState(false); // 사용자 권한/구독 관리 모달 상태
  const [mailModal, setMailModal] = useState(false); // 메일 보내기 모달 상태
  const [detail, setDetail] = useState(""); // 메일 내용
  const [authority, setAuthority] = useState(""); // 사용자의 권한 상태
  const [subscirbeDataList, setSubscribeDataList] = useState({}); // 구독 상품 데이터 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 구독 상품 리스트가 변경될 때, 구독 데이터 리스트를 갱신합니다.
  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  // 권한 변경 버튼 클릭 시, 해당 사용자의 정보를 가져오고 모달을 엽니다.
  const onClickChangeAuthority = (userId) => {
    setAdminModal(!adminModal); // 모달 열기/닫기
    getUserInfo(userId, userInfo); // 선택한 사용자 정보 가져오기
    setAuthority(userDetailInfo?.authority); // 사용자의 현재 권한 설정
  };

  // 사용자 정보 아이콘 클릭 시, 해당 사용자 상세 정보 모달을 엽니다.
  const onClickGetUserDetailInfo = (userId) => {
    setModal(!modal); // 모달 열기/닫기
    getUserInfo(userId, userInfo); // 선택한 사용자 정보 가져오기
  };

  // 메일 보내기 버튼 클릭 시, 메일 모달을 열고 해당 사용자 정보 설정
  const onClickMail = (userId) => {
    setMailModal(!mailModal); // 메일 모달 열기/닫기
    getUserInfo(userId, userInfo); // 선택한 사용자 정보 가져오기
  };

  // 메일 전송
  const onSubmitMail = () => {
    setMailModal(false); // 메일 모달 닫기
    mailPost(userDetailInfo?.userId, detail, userInfo); // 메일 전송 API 호출
  };

  // 페이지에 맞게 사용자 리스트를 분할하여 표시
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };

  // 현재 페이지에 맞는 사용자 리스트
  const paginatedUserList = paginate(userList, currentPage);

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        {/* 사용자 관리 제목 */}
        <div className={styles.title}>사용자 관리</div>
        <div className={styles.subtitle}>
          <div className={styles.username}>ID</div>
          <div className={styles.nickname}>Name</div>
          <div className={styles.functions}>Tools</div>
        </div>

        {/* 사용자 리스트 */}
        {paginatedUserList.length > 0 && (
          <>
            {paginatedUserList.map((v) => (
              <div key={shortid.generate()}>
                <hr />
                <div
                  className={
                    v.userStatus === "INACTIVE" // 사용자 상태에 따라 스타일 지정
                      ? styles.users_inactive
                      : styles.users
                  }
                >
                  {v.username}
                  <div>{v.nickName}</div>
                  <span>
                    {/* 사용자 상세 정보 보기 */}
                    <FontAwesomeIcon
                      icon={faUser}
                      onClick={() => onClickGetUserDetailInfo(v.userId)}
                    />
                    {/* 권한/구독 관리 */}
                    <FontAwesomeIcon
                      icon={faUserGear}
                      onClick={() => onClickChangeAuthority(v.userId)}
                    />
                    {/* 메일 보내기 */}
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      onClick={() => onClickMail(v.userId)}
                    />
                  </span>
                </div>
                <hr />
              </div>
            ))}
          </>
        )}

        {/* 페이지네이션 컴포넌트 */}
        <Paginatation
          contents={userList}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={handlePageChange}
        />

        {/* 사용자 상세 정보 모달 */}
        {modal === true && (
          <AdminUserDetail
            userDetailInfo={userDetailInfo}
            setModal={setModal}
          />
        )}

        {/* 권한/구독 관리 모달 */}
        <AdminUserAdminModal
          adminModal={adminModal}
          setAdminModal={setAdminModal}
          authority={authority}
          setAuthority={setAuthority}
          subscirbeDataList={subscirbeDataList}
          userDetailInfo={userDetailInfo}
          userInfo={userInfo}
          getUserInfo={getUserInfo}
          reviseUserInfo={reviseUserInfo}
        />

        {/* 메일 보내기 모달 */}
        <AdminScheduleModal
          modal={mailModal}
          setModal={setMailModal}
          status={null}
          title={"메일 보내기"}
          requestUsername={userDetailInfo?.username}
          detail={detail}
          setDetail={setDetail}
          setStatus={null}
          onSubmitChange={onSubmitMail}
          onSubmitDelete={null}
        />
      </div>
    </>
  );
};

export default AdminUser;
