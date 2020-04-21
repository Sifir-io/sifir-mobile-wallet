package com.sifir;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.rudderstack.android.sdk.core.RudderClient;
import com.rudderstack.android.sdk.core.RudderConfig;
import com.rudderstack.android.sdk.core.RudderLogger;
import com.rudderstack.android.sdk.core.RudderMessageBuilder;

import java.util.HashMap;
import java.util.Map;

public class Rudder extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private RudderClient client;

    public Rudder(ReactApplicationContext context) {
        super(context);
        this.client = RudderClient.getInstance(
                context,
                "1YST7ARggOUXVKmylkX9K7Rk7w5",
                new RudderConfig.Builder()
                        .withEndPointUri("https://hosted.rudderlabs.com")
//                        .withLogLevel(RudderLogger.RudderLogLevel.DEBUG)
                        .withTrackLifecycleEvents(true)
                        .build()

        );
    }

    @Override
    public String getName() {
        return "Rudder";
    }

    @ReactMethod
    public void event(String eventName, String eventJson) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("event_json", eventJson);
        this.client.track(
                new RudderMessageBuilder()
                        .setEventName(eventName)
                        .setProperty(properties)
                        .build()
        );
    }
}
