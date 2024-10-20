/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ShoyoImport } from './routes/shoyo'
import { Route as KageyamaImport } from './routes/kageyama'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const ShoyoRoute = ShoyoImport.update({
  path: '/shoyo',
  getParentRoute: () => rootRoute,
} as any)

const KageyamaRoute = KageyamaImport.update({
  path: '/kageyama',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/kageyama': {
      id: '/kageyama'
      path: '/kageyama'
      fullPath: '/kageyama'
      preLoaderRoute: typeof KageyamaImport
      parentRoute: typeof rootRoute
    }
    '/shoyo': {
      id: '/shoyo'
      path: '/shoyo'
      fullPath: '/shoyo'
      preLoaderRoute: typeof ShoyoImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/kageyama': typeof KageyamaRoute
  '/shoyo': typeof ShoyoRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/kageyama': typeof KageyamaRoute
  '/shoyo': typeof ShoyoRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/kageyama': typeof KageyamaRoute
  '/shoyo': typeof ShoyoRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/kageyama' | '/shoyo'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/kageyama' | '/shoyo'
  id: '__root__' | '/' | '/about' | '/kageyama' | '/shoyo'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  KageyamaRoute: typeof KageyamaRoute
  ShoyoRoute: typeof ShoyoRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  KageyamaRoute: KageyamaRoute,
  ShoyoRoute: ShoyoRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/kageyama",
        "/shoyo"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/kageyama": {
      "filePath": "kageyama.tsx"
    },
    "/shoyo": {
      "filePath": "shoyo.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
