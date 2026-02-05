import Decimal from "decimal.js";
import { DECIMAL_CONFIG } from "@/constants";

// 全局配置 Decimal 精度
Decimal.set({
  precision: DECIMAL_CONFIG.PRECISION,
  rounding: DECIMAL_CONFIG.ROUNDING,
  toExpNeg: DECIMAL_CONFIG.TO_EXP_NEG,
  toExpPos: DECIMAL_CONFIG.TO_EXP_POS,
});

export default Decimal;
