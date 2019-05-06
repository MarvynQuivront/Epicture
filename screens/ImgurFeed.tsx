import {View, Text,} from "react-native";
import * as React from "react";
import {Component} from "react";
import {JsonObject, JsonProperty} from "json2typescript";
import {bool} from "prop-types";

@JsonObject("ImgurPicture")
export class ImgurPicture {
    @JsonProperty("id", String)
    id: string = undefined;

    @JsonProperty("id", String)
    key:string = undefined;

    @JsonProperty("link", String)
    link: string = undefined;
}

@JsonObject("data")
export class Dat {
    @JsonProperty("id", String)
    id: string = undefined;

    @JsonProperty("title", String)
    title: string = undefined;

    @JsonProperty("description", String)
    description: string = undefined;

    @JsonProperty("datetime", Number)
    datetime: number = undefined;

    @JsonProperty("account_id", Number)
    account_id: number = undefined;

    @JsonProperty("link", String)
    link: string = undefined;

    @JsonProperty("favorite", Boolean)
    favorite: boolean = undefined;

    @JsonProperty("images", [ImgurPicture], true)
    images: ImgurPicture[] = undefined;

    @JsonProperty("id", String)
    key: string = undefined;
}

@JsonObject("Feed")
export class Feed {
    @JsonProperty("data", [Dat])
    data: Dat[] = undefined;
}
