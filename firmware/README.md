# AirU V2 Repository

* Follow the [Espressif Getting Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/get-started/ "Espressif Getting Started Guide") to get the Espressif IDF and toolchain installed

* After you have successfully completed that tutorial, get the project running in Eclipse with the [Build and Flash with Eclipse IDE Tutorial](https://docs.espressif.com/projects/esp-idf/en/latest/get-started/eclipse-setup.html "Eclipse IDE Tutorial")

## Installation Notes
* You need to download the latest [Java SE Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html "Java SE Development Kit") before you download Eclipse
* When asked where you want your Eclipse workspace, choose your esp folder. For example, I followed the Espressif tutorial to install the IDF, and they had me create my esp folder in `~/esp/`, so this was my workspace location.
* Set up a workspace configuration so when you create new projects you don't have to create this configuration every time.
  * Right-click project and open Properties
  * Click C/C++ General tab
  * On the right-hand side is an option to "Configure Workspace Settings..."
  * Go through the linked tutorial again and change the settings in this new window.
  * Click Apply and Close
  * The Build Configuration needs to be created next
  * Go to C/C++ General &rarr; Preprocessor Include Path and click on the "Providers" tab
  * Click Manage Configurations... in the top right-hand corner
  * Create a new Configuration
  * With this new configuration change the "CDT Cross GCC Built-in Compiler Settings" and "CDT GCC Build Output Parser" like the Espressif tutorial says. Now you can select this configuration when you create a new project and these settings should appear.

## Project Notes
* Make sure the project you'd like to load into Eclipse is in your `~/esp/` directory. For example, I have the project `~/esp/AirUv2.0/`. Then import the project in Eclipse with File &rarr; Import, then C/C++ &rarr; Existing Code As Makefile Project, then select your project.
* If you click on the top-level Makefile, you can change the build name (this will affect the .bin, .elf, .map files)


