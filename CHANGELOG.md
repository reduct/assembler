# Change Log

## 0.1.2

**Fixed issues:**
- Fixed the general RegExp which matches all words for the 'nonIndexedComponentPolicies' option.
- Fixed the multiple instantiation of the FallBackRule Constructors

## 0.1.1

**Fixed issues:**
- Fixed the execution of the parse method.

## 0.1.0

**Implemented enhancements:**
- Added a 'addComponent()' method.
- Added a 'isLoggingEnabled' option for the Constructor and turn of logging messages by default.
- Renamed the fallback option to 'nonIndexedComponentPolicies'.

## 0.0.2

**Implemented enhancements:**
- Implement a initialized cache to prevent applying the same constructor on elements which have already been mounted again.
- Moved the contextElement option into the .parse() method for better re-usability of the parser instance.
- Removed unnecessary argument fallbacks in the '_mountComponent' method.

## 0.0.1 (Initial version)
