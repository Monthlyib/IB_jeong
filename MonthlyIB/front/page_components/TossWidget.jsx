import { loadTossPayments } from "@tosspayments/payment-sdk";

const TossWidget = ({ customerKey }) => {
  console.log(customerKey);
  var clientKey = "test_ck_26DlbXAaV0dxpqpbA24nVqY50Q9R";
  loadTossPayments(clientKey).then((tossPayments) => {
    // ------ 카드 등록창 호출 ------
    tossPayments
      .requestBillingAuth("카드", {
        // 결제수단 파라미터 (자동결제는 카드만 지원합니다.)
        // 결제 정보 파라미터
        // 더 많은 결제 정보 파라미터는 결제창 Javascript SDK에서 확인하세요.
        // https://docs.tosspayments.com/reference/js-sdk#requestbillingauth카드-결제-정보
        customerKey: { customerKey }, // 고객 ID로 상점에서 만들어야 합니다. 빌링키와 매핑됩니다. 자세한 파라미터 설명은 결제 정보 파라미터 설명을 참고하세요.
        successUrl: "https://localhost:3000/addcard/success", // 카드 등록에 성공하면 이동하는 페이지(직접 만들어주세요)
        failUrl: "https://localhost:3000/addcard/fail", // 카드 등록에 실패하면 이동하는 페이지(직접 만들어주세요)
      })
      // ------ 결제창을 띄울 수 없는 에러 처리 ------
      // 메서드 실행에 실패해서 reject 된 에러를 처리하는 블록입니다.
      // 결제창에서 발생할 수 있는 에러를 확인하세요.
      // https://docs.tosspayments.com/reference/error-codes#결제창공통-sdk-에러
      .catch(function (error) {
        if (error.code === "USER_CANCEL") {
          // 결제 고객이 결제창을 닫았을 때 에러 처리
        }
      });
  });
  return <></>;
};

export default TossWidget;
