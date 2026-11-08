+++
title = "Kitchen sink"
date = 2026-11-08
description = "Test page for every element a post uses. Draft: never published."
draft = true  # test page: copy into content/posts/ to preview, never commit it there
[extra]
math = true
+++

A paragraph with a [link](https://hectorsuzanne.com), some `inline code`, and a footnote.[^1] "Smart quotes" and an em-dash -- like this.

A longer paragraph, to see two notes stack in the margin. Model checkers represent systems as arrays indexed by node and a collection of transitions,[^2] which erases control flow. The rule-based encoding smears the original intents together to faithfully represent real-life concurrency, but it comes at a cost: systems are designed in terms of narratives,[^3] and the checker no longer sees them. Same note again.[^1]

## A section

> A blockquote, for when someone else said it better.

Inline math $\Gamma \vdash t : A$ and display math (markdown eats `\,` and `\\`, so write `\\,` and `\\\\`):

$$ \frac{\Gamma, x : A \vdash t : B}{\Gamma \vdash \lambda x.\\, t : A \multimap B} $$

### A subsection

```ocaml
let rec fold f acc = function
  | [] -> acc
  | x :: xs -> fold f (f acc x) xs
```

| Model | Tips | Filaments |
|---|---|---|
| FitzHugh–Nagumo | 2 | 1 |

[^1]: The footnote itself.
[^2]: Cubicle, for instance. A note with a [link](https://cubicle.lri.fr) and `code`.
[^3]: A long note, long enough to wrap over several lines in the margin, so we can check that the next note is pushed down rather than overlapping it, and that the popover scrolls on a phone if it gets taller than half the screen.

    It even has a second paragraph.
