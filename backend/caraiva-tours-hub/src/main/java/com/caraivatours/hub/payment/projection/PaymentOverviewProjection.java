package com.caraivatours.hub.payment.projection;

import java.math.BigDecimal;

public interface PaymentOverviewProjection {
    BigDecimal getReceivedDepositAmount();
    BigDecimal getAwaitingReceiptAmount();
    BigDecimal getRemainingAmount();
}
