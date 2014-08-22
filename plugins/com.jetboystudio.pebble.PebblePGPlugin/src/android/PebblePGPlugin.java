package com.jetboystudio.pebble;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.UUID;

import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.Constants;

public class PebblePGPlugin extends CordovaPlugin {
    private PebbleKit.PebbleDataLogReceiver mDataLogReceiver = null;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext cb) throws JSONException {
        switch (action) {
            case "areAppMessagesSupported":
                cb.success(PebbleKit.areAppMessagesSupported(getApplicationContext()));
                break;

            case "isWatchConnected":
                cb.success(PebbleKit.isWatchConnected(getApplicationContext()));
                break;
            
            default:
                return false;
                break;
        }

        return true;
    }
}