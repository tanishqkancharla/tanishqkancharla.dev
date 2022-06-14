#!/usr/bin/env ts-node
import { defaultWebsiteContext } from "./src/config";
import { buildWebsite } from "./src/server/buildWebsite";

buildWebsite({ ...defaultWebsiteContext, mode: "PROD" });
