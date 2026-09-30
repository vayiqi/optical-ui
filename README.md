# Optical UI

UI components with tactile surfaces and continuous motion. Copy the source, change the styles, and use the pieces you need.

[Explore the components](https://deepcake.ai/opticalui) · [Deepcake](https://deepcake.ai)

## Add it to your app

You need a React 19 app with TypeScript and a bundler that supports CSS imports, such as Vite or Next.js.

**1. Get the source.** Clone this repository or choose **Code → Download ZIP**. Copy `src/` into your app as `components/optical-ui/`.

**2. Install the dependencies.**

```sh
npm install @base-ui/react@^1.7 lucide-react@^1.31 motion@^13.2
```

Use your usual package manager. Keep your app's existing React and React DOM installations on version 19.

**3. Use a component.**

```tsx
'use client';

import { useState } from 'react';
import { Button, OpticalProvider, Switch } from './components/optical-ui';

export function Settings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <OpticalProvider>
      <Switch
        label="Notifications"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Button onClick={() => console.log({ enabled })}>Save settings</Button>
    </OpticalProvider>
  );
}
```

The modules import their own CSS. No Tailwind setup is needed. In Next.js, keep interactive components inside a client component.

You can copy the whole folder or extract a component and its local imports. Keep its styles and motion helpers together. [Component reference →](docs/components.md)

## Make it yours

Change the shared theme through the provider:

```tsx
<OpticalProvider theme={{ hue: 225, saturation: 66, radius: 12 }}>
  <Button>Continue</Button>
</OpticalProvider>
```

`hue` accepts 0–360, `saturation` 0–90, and `radius` 2–24. The default is terracotta on warm paper. The palette stays consistent in menus and dialogs, too.

Edit the CSS or component source for deeper changes. Native and Base UI props let you connect controls to your own forms, state, and event handlers. The examples use local state; replace it with your application's behavior.

## Try the examples locally

```sh
git clone https://github.com/vayiqi/optical-ui.git
cd optical-ui
npm install
npm run dev
```

Use Node.js 22.12 or newer. Open the local URL printed in your terminal. All 60 examples are available from the list. Run `npm run build` to check types and build the example app.

The four material examples in `public/material/` also work as standalone HTML files. Open one in a browser, or copy its HTML, CSS, and JavaScript into your project.

## What's inside

| Folder | Contents |
| --- | --- |
| `src/system/` | 32 reusable controls, shared theme and motion helpers, and 10 signature examples |
| `src/components/` | 14 interactive patterns, including context selection, comparison, and interruption |
| `public/material/` | Pocket, Spool, Index, and Press as standalone HTML |
| `examples/` | A small app for trying every component |

Keyboard behavior comes from native controls and Base UI where applicable. Components respect reduced-motion preferences. Test the components with your own content and supported devices before shipping.

## License

[MIT](LICENSE) — free to use, modify, and distribute in personal or commercial projects. Keep the copyright and license notice when redistributing the source.

The numeral outlines retain their [SIL Open Font License](src/system/fonts/Space-Grotesk-OFL.txt). See [third-party notices](THIRD_PARTY_NOTICES.md).

By Yiqi Zhao / [Deepcake](https://deepcake.ai).
