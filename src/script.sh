#!/bin/bash
set -e
IFS='|'

AUTHCONFIG="{\
\"facebookAppId\":\"fbid1\",\
\"googleClientId\":\"goog\",\
\"facebookAppIdUserPool\":\"facebookAppId\",\
\"facebookAppSecretUserPool\":\"facebookAppSecret\",\
\"googleAppIdUserPool\":\"facebookAppSecret\",\
\"googleAppSecretUserPool\":\"googleAppSecret\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"default\"\
}"

AMPLIFY="{\
\"envName\":\"test\"\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"
CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes