# Purpose

Example project for nx issue https://github.com/nrwl/nx/issues/14067

# Steps to Reproduce
```
git clone https://github.com/ryangrahamnc/symlinked-nx-projs-issue
cd symlinked-nx-projs-issue/blog
npm i
npx nx serve blog-ui
```

# Problem description 

I have two nx monorepos:
```
npms-nx: list of npm packages I want to use in any of my projects
  packages/
    utils/ <-- [aka @my/utils] contains basic functions I use a lot
    react-utils/ <-- [aka @my/react-utils] contains react comps/hooks I use a lot
```
```
blog-nx: 
  apps/
    blog-ui/
```
I want to use **@my/utils** and **@my/react-utils** in the `blog-ui` app. But since its a separate nx project, I need to publish those packages every time I want to test a change.

So instead, I tried adding a `blog-nx/packages` folder, and symlinked `npms-nx/packages/utils` to it. So now I have:
```
blog-nx: 
  apps/
    blog-ui/
  packages/
    utils/ <-- symlink to ../../npms-nx/packages/utils
    react-utils/ <-- symlink to ../../npms-nx/packages/react-utils
```
And added path aliases to my `blog-nx/tsconfig.base.json` to link everything up:
```json
"paths":{
  "@my/react-utils": ["packages/react-utils/src/index.ts"],
  "@my/utils": ["packages/utils/src/index.ts"]
}
```

This sets the path naming to match exactly what was used in the npms-nx repo. So the project.json's are always happy. Overall its exactly the same as a regular project structure. The only difference is the packages names are symlinks rather than folders.

Initially, that works amazingly. I can edit the files in `@my/utils`, and the changes automatically show up in my UI without having to do manual builds or publishing.

But, I start getting errors if I use a symlinked package that imports another symlinked package.

For instance, if I make **@my/react-utils** import a function from **@my/utils**, I start getting this error:
`Failed to resolve import "@my/utils" from "../npms-nx/packages/react-utils/src/lib/react-utils.tsx". Does the file exist?`

Running `npx nx graph` for both identifies the problem:

**npms-nx:**
<img width="236" alt="image" src="https://user-images.githubusercontent.com/1237156/210122354-70450b72-8b44-437c-afd6-be220aa67b67.png">

**blog:**
<img width="483" alt="image" src="https://user-images.githubusercontent.com/1237156/210122363-ef985d14-7bcb-453a-ae55-5df8a40ae17d.png">

**npms-nx** properly identifies the link between `react-utils` and `utils`. The **blog** graph does not.

I believe this is caused by the symlink paths getting resolved, so it sees the `../../` and believes the dir doesnt exist in the repo. And therefore assumes its an external package.

Any advice on how to fix this? And/or maybe theres another way to do what I want? I cant tell if this symlink structure was designed to be a feature or not. But I find it useful, given I like to work on multiple projects and use common libs between them.

