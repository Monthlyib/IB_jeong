import AppLayout from "../../main_components/AppLayout";
import styles from "../../styles/pay.module.css";
import basicImg from "../../assets/img/common/basic_plan.jpg";
import superImg from "../../assets/img/common/super_plan.jpg";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { userActions } from "../../reducers/user";

const Pay = () => {
  const router = useRouter();
  const { valueArray, months, oriPriceArray, modal, basicOrSuper } =
    router.query;

  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.user);

  useEffect(() => {
    if (valueArray === undefined) {
      router.push("/subscribe");
    }
  }, [valueArray]);

  const { getPaymentInfoDone, cardInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (getPaymentInfoDone === false) {
      dispatch(userActions.getPaymentInfoRequest());
    }
  }, [getPaymentInfoDone]);

  if (!valueArray || !months || !oriPriceArray || !modal || !basicOrSuper) {
    return <></>;
  } else {
    const parsedValueArray = JSON.parse(valueArray);
    const parsedMonths = JSON.parse(months);
    const parsedOriPriceArray = JSON.parse(oriPriceArray);
    const parsedModal = Number(modal);
    const parsedPlan = Number(basicOrSuper);
  }

  const onSumbitPay = useCallback((e) => {
    dispatch(
      userActions.subscribePlanRequest({
        plan: parsedPlan,
        card: cardInfo.num,
        term: parsedMonths,
        installment: 0,
      })
    );
  }, []);

  var regex = /[^0-9]/g;
  const currentValInNumbers =
    parsedValueArray[parsedModal].replace(regex, "") + "0000";
  const currentOriValInNumbers =
    parsedModal === 0
      ? currentValInNumbers
      : parsedOriPriceArray[parsedModal].replace(regex, "") + "0000";

  const localedCurrentValNum = currentValInNumbers.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  const localedOriValNum = currentOriValInNumbers.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  const salePrice =
    Number(currentValInNumbers) - Number(currentOriValInNumbers);
  const localedSalePrice = salePrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <AppLayout>
        <main className={`width_content ${styles.pay}`}>
          <div
            className="header_tit_wrap"
            style={{ padding: "5.6rem 0 3.8rem" }}
          >
            <h2>결제하기</h2>
          </div>

          <div className={styles.pay_box_wrap}>
            <div className={styles.pay_left}>
              <div className={styles.product_cont}>
                <div className={styles.product_item}>
                  <figure>
                    {parsedPlan === 1 ? (
                      <Image src={basicImg} alt="베이직 구독 이미지" />
                    ) : (
                      <Image src={superImg} alt="수퍼 구독 이미지" />
                    )}
                  </figure>
                  <div className={styles.product_item_info}>
                    <div className={styles.product_item_nm}>
                      {parsedPlan === 1 ? <p>BASIC PLAN</p> : <p>SUPER PLAN</p>}

                      <span>월 자동결제</span>
                    </div>
                    <div className={styles.product_item_price}>
                      <div className={styles.product_price_cont}>
                        <span className={styles.product_price}>
                          {parsedValueArray[parsedModal]}
                        </span>
                        <b>/</b>
                        <span className={styles.product_month}>
                          {parsedMonths[parsedModal]}
                        </span>
                      </div>
                      <div className={styles.product_ori_price_cont}>
                        <span className={styles.product_ori_price}>
                          {parsedOriPriceArray[parsedModal]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.pay_right}>
              <div className={styles.pay_box_top}>
                <div className={styles.buyer_info}>
                  <h4>구매자 정보</h4>

                  <div className={styles.buyer_input}>
                    <input type="text" value={User.name} disabled />
                    <input
                      type="text"
                      value={User.email}
                      placeholder="영수증 받으실 이메일을 입력하세요."
                    />
                  </div>
                </div>
                <div className={styles.price_info}>
                  <div className={styles.pricing_price}>
                    <h6>금액</h6>

                    <span>
                      <b>{localedOriValNum}</b> 원
                    </span>
                  </div>
                  <div className={styles.pricing_sales}>
                    <h6>할인된 금액</h6>
                    <span>
                      <b>{localedSalePrice}</b> 원
                    </span>
                  </div>
                  <div className={styles.pricing_total}>
                    <h6>총 결제금액</h6>
                    <span>
                      <b>{localedCurrentValNum}</b> 원
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.pay_box_bottom}>
                {Object.entries(cardInfo).length === 0 ? (
                  <button
                    type="submit"
                    className={styles.btn_disabled}
                    disabled={true}
                  >
                    카드정보가 없습니다.
                  </button>
                ) : (
                  <button type="submit" onClick={onSumbitPay}>
                    구매하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
};

export default Pay;
