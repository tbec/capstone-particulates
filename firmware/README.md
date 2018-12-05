# AirU V2 Repository

# TODO:
- Upload data from SD card when board comes back online
    - log disconnect timestamps. When board comes back online, send all relevant .csv files (which are day to day files)
        - must be careful about WiFi disconnects during this time. If the board just came back online it's possible it'll go back offline soon for the same reason it went off before, so make sure everything gets cleaned up if you lose connection during a file transfer
- Use GPS timestamps to update system time while offline. This might be tricky because we're using the standard 'time' library, which just communicates over SNTP without our intervention. However, I think the only time you'll need timestamps while the board is offline is when you're writing to the SD card, so maybe you can just keep a completely separte time struct for the GPS. For instance, put a timer interrupt on the 1PPS pin and update a struct with "seconds active" and "UNIX time" variables. You can make sure these are accurate by updating them with the GPS timestamp packets from time to time, but I think the 1PPS interrupt comes from the GPS RTC so it should be perfectly timed. Then when you need to write to the SD card and don't have internet connection you can just grab the UNIX time from the GPS time struct.
- Functions with long delays, like the MQTT data publish task, will work best if attached to an atomically accurate timer (Like the 1PPS interrupt), instead of vTaskDelay(). This will save you a ton of trouble when someone needs you to write code that will publish or save data at exact increments. For example the sensors we use for calibration need exact 15 seconds intervals that are all synced up.
- Logging errors and warnings could fill up the SD card. Make sure your file writes go through a wrapper function that will delete old files if necessary before writing.

## Debugging Tools:
- Store MAC of router, we can look these up to see if brands behave differently
- Log some data on SD card. Logs can be deleted/download over HTTPS via MQTT
- A debugging mode on MQTT. You enable it then receive debug info and can issue debug commands
- Keep internal stats like number of connects, disconnects, IP addresses,


