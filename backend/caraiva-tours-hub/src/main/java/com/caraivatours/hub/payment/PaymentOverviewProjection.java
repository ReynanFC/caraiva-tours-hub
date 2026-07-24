package com.caraivatours.hub.payment;

import java.math.BigDecimal;

public interface PaymentOverviewProjection {
    BigDecimal getReceivedDepositAmount();
    BigDecimal getAwaitingReceiptAmount();
    BigDecimal getRemainingAmount();
}
