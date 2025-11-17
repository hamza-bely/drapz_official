package com.drapz.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.stripe")
public class StripeConfig {

    public String apiKey;
    public String webhookSecret;

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setWebhookSecret(String webhookSecret) {
        this.webhookSecret = webhookSecret;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getWebhookSecret() {
        return webhookSecret;
    }

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = this.apiKey;
    }
}
