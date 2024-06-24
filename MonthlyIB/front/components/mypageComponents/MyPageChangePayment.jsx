// "use client";
// import styles from "./MyPage.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
// import { useCallback, useEffect } from "react";
// import { useRouter } from "next/router";

// const MyPageChangePayment = ({ closeRef, setModal }) => {
//   const router = useRouter();
//   const { getPaymentInfoDone, cardInfo, User } = useSelector(
//     (state) => state.user
//   );

//   useEffect(() => {
//     if (getPaymentInfoDone === false) {
//       dispatch(userActions.getPaymentInfoRequest());
//     }
//   }, [getPaymentInfoDone]);

//   const onClickAddPayment = useCallback(() => {
//     router.push({
//       pathname: "/addcard",
//       query: { customerKey: User.customerKey },
//     });
//   }, []);

//   return (
//     <>
//       <div className={styles.md}>
//         <div
//           className={styles.md_box_flex}
//           ref={closeRef}
//           onClick={(e) => closeRef.current === e.target && setModal(false)}
//         >
//           <div className={styles.md_box}>
//             <div className={styles.md_top}>
//               <div className={styles.tit}>결제수단 변경</div>

//               <div className={styles.content}>
//                 <div className={styles.md_section}>
//                   <div className={styles.md_sub_tit}>
//                     <h5>현재 결제수단</h5>
//                     <span>다음결제일 : 2022-04-12</span>
//                   </div>
//                   {cardInfo.length === 0 ? (
//                     <div
//                       className={`${styles.md_sub_content} ${styles.sub_flex_content}`}
//                     >
//                       <p>카드 정보가 존재하지 않습니다.</p>
//                     </div>
//                   ) : (
//                     <div
//                       className={`${styles.md_sub_content} ${styles.sub_flex_content}`}
//                     >
//                       <p>{cardInfo[0].company}</p>
//                       <span>
//                         <FontAwesomeIcon icon={faCreditCard} />
//                         <b>{cardInfo[0].number}</b>
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div className={styles.md_section}>
//                   <div className={styles.md_sub_tit}>
//                     <h5>결제수단 변경</h5>
//                   </div>
//                   <div
//                     className={styles.md_sub_content}
//                     onClick={onClickAddPayment}
//                   >
//                     <FontAwesomeIcon icon={faCreditCard} /> 신용카드 / 체크카드
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <button type="button" className={styles.md_btn}>
//               변경
//             </button>
//           </div>
//         </div>
//         <div className={styles.md_dim}></div>
//       </div>
//     </>
//   );
// };

// export default MyPageChangePayment;
