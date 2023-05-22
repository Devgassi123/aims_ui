import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/actions/currency";
import { getCurrencyConversions } from "../../redux/actions/currency_conversion";

const MoneyFormat = ({money,currencyId=0}) => {
  const [currency, setCurrency] = useState({
    symbol: "Php",
    decimalPlaces: 2,
  });
  //Get Currency
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);
  const currencyConversionList = useSelector(
    (state) => state.currencyConversionReducer.document
  );
  const currencyList = useSelector((state) => state.currencyReducer.document);

  useEffect(() => {
    stableDispatch(getCurrency());
    stableDispatch(getCurrencyConversions());
  }, [stableDispatch]);

  const getInitialCurrency = () => {
    if (currencyConversionList.length !== 0 && currencyList.length !== 0) {
      const selectedItem = currencyConversionList.find(
        (x) => x.is_home_currency === true
      );
       const currencyID =
         currencyId !== 0 ? currencyId : selectedItem.currency_id;

      setCurrency({
        symbol: getSymbol(currencyID),
        decimalPlaces: getDecimalPlaces(currencyID),
      });
    }
  };

  const getInitialCurrencyCallBack = useCallback(getInitialCurrency, [
    currencyConversionList,
    currencyList,
    currencyId,
  ]);

  useEffect(() => {
    getInitialCurrencyCallBack();
  }, [getInitialCurrencyCallBack]);

  const getSymbol = (currency_id) => {
    let ret = "Php";
    if (currency_id !== 0) {
      const selectedItemCurrency = currencyList.find(
        (x) => x.currency_id === currency_id
      );
      ret = selectedItemCurrency.symbol;
    }

    return ret;
  };
  const getDecimalPlaces = (currency_id) => {
    let ret = 2;
    if (currencyList.length !== 0 && currency_id !== 0) {
      const selectedItemCurrency = currencyList.find(
        (x) => x.currency_id === currency_id
      );

      ret = selectedItemCurrency.decimal_places;
    }

    return ret;
  };

  return (
    <div>
      {currency.symbol} {parseFloat(money ? money : 0).toFixed(currency.decimalPlaces)}
    </div>
  );
}

export default MoneyFormat;
