NAME=Epicture
VERSION=0.0.1


$(NAME):
	wget -q -N 'https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40soleil-de-feu/DEV_2018_Epicture-99e3ad0428f94f539dd6fcdb7a1626ab-signed.apk'
clean:
	ls
fclean:
	ls
re:$(NAME)
	ls
all:$(NAME)
	ls
