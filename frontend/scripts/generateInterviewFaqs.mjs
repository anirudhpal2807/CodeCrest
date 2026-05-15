/** One-off generator: writes src/data/interviewFaqs.ts */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const topics = [
  {
    stem: 'Data structures — Arrays',
    pairs: [
      ['What does O(1) random access imply for algorithms using arrays?', 'Array indices reach memory in constant time because the element address is base + index × stride. That drives two-pointer scans, sliding windows, and in-place rotates but does not automatically make inserts O(1).'],
      ['When is a sliding window preferable to nested loops on an array?', 'When the optimum for every window can be deduced by adding one element and dropping another in amortized constant time rather than recomputing the whole slice. Typical examples are substring with at most k distinct chars or minimum subarray sums.'],
      ['How do prefix sums accelerate range queries?', 'Compute cumulative sums once in O(n) so any sum from i through j resolves as prefix[j]-prefix[i-1]. Trade memory for turning each query into arithmetic instead of iterating the span.'],
    ],
  },
  {
    stem: 'Linked lists',
    pairs: [
      ['Why reverse a linked list iteratively versus recursively?', 'Iterative reversing uses O(1) auxiliary space besides pointers while naive recursion consumes O(n) stack frames until tail-call optimization is unavailable. Interviewers prefer the iterative three-pointer sketch.'],
      ['How detect a cycle without extra hashing?', 'Floyd tortoise-and-hare: advance slow one step and fast two steps—meeting proves a cycle; reset one pointer to head and march both one step each to locate the junction.'],
      ['Difference between merges on arrays versus linked lists?', 'Linked lists splice without shifting elements making merge sort achievable in O(n log n) time with only pointer swaps, unlike array merges that need auxiliary buffers proportional to merges.'],
    ],
  },
  {
    stem: 'Stacks & queues',
    pairs: [
      ['What problem pattern maps naturally to monotone stacks?', 'Next greater/smaller elements: maintain decreasing stack values and pop while current element exceeds peek, recording answers once relationship known. Complexity stays linear because each item pushes once.'],
      ['How implement a queue using two stacks?', 'Push everything onto inbox stack; dequeue pops from outbox refill by transferring inbox whenever outbox empty—each element moves at most twice amortized giving O(1) amortized dequeue.'],
      ['Why use deque for sliding window minimum?', 'Monotonic deque retains candidate indices sorted by values so shrinking window drops obsolete indices from front while enforcing order from back—each index enqueued/dequeued once.'],
    ],
  },
  {
    stem: 'Hash tables',
    pairs: [
      ['Average vs worst-case hashing performance?', 'Average O(1) assumes good spread and bounded load factor; adversarial keys can degrade to chains length O(n) unless universal hashing plus resizing mitigates hotspots.'],
      ['When does a multiset need a trie instead of a hash map?', 'When querying lexicographical neighbors, autocomplete prefixes, or counting shared prefixes dominates point lookups hashed strings cannot traverse incrementally across shared structure.'],
      ['Collisions in JS Map objects?', 'Modern engines probe or chain internally; interviewer expectation is acknowledging worst-case degrade and guarding with equal hash redistribution when rolling custom buckets.'],
    ],
  },
  {
    stem: 'Trees — BST basics',
    pairs: [
      ['Validate BST invariant in one traversal?', 'Track allowed min/max window per subtree; left child must lie below parent and above inherited floor, right symmetrical—O(n) time O(h) recursion stack.'],
      ['Why augment BST with subtree sizes?', 'To answer order-statistics: rank queries need knowing left subtree cardinality before deciding recurse direction and subtracting counted nodes. Rotations update aggregates carefully.'],
      ['Balance importance for interview trees?', 'Unbalanced BST hits O(n) depth; AVL/red-black guarantee O(log n) height so operations predictable—often abstracted unless rotation details requested.'],
    ],
  },
  {
    stem: 'Heaps & priority queues',
    pairs: [
      ['Heapify versus repeated insert?', 'Heapify bottoms-up adjusts each subtree in reverse level order yielding O(n) total vs n inserts costing O(n log n); building from array prefers heapify trick.'],
      ['When fractional knapsack needs greedy heap?', 'Rarely—you sort items by value/weight ratio once; heaps appear when greedy choices depend on dynamically changing best fronts like merging k sorted arrays.'],
      ['Two heaps median trick?', 'Lower half max-heap mirrors upper half min-heap; insert balancing sizes so median always root of larger heap or average of tops when balanced—O(log n).'],
    ],
  },
  {
    stem: 'Graph traversal',
    pairs: [
      ['BFS vs DFS for shortest unweighted paths?', 'BFS expands layer by layer preserving minimal edge count whereas DFS explores deep branches first and misses earliest layers unless memoized revisit strategy added.'],
      ['Detect bipartite graph?', 'Color start node; neighbors must alternate colors—conflict proves odd cycle; DFS/BFS propagate constraints and run O(V+E).'],
      ['Topological order prerequisites?', 'Only DAGs—run DFS finishing times or indegree peeling; cycles leave nodes with perpetual positive indegree so queue drains early revealing impossibility.'],
    ],
  },
  {
    stem: 'Dynamic programming patterns',
    pairs: [
      ['Bottom-up DP vs memoized recursion?', 'Bottom-up avoids stack limits and locality benefits; memoized top-down expresses recurrence directly mirroring proofs but risks stack overflow on huge depth despite identical asymptotics.'],
      ['How spot overlapping subproblems?', 'Branches recompute identical parameters—cache keyed by tuples of indices/decisions turns exponential brute force into pseudopolynomial or polynomial memo tables.'],
      ['Space optimize 1D knapsack?', 'Iterate weights descending when reusing single array row so combining item i does not read already-updated dp[w-weight] belonging to same iteration.'],
    ],
  },
  {
    stem: 'Binary search',
    pairs: [
      ['Why variants for lower bound versus upper bound?', 'Three-pointer partition handles duplicates; invariant keeps answer inside shrinking closed interval distinguishing first ≥ target versus last ≤ target implementations.'],
      ['Binary search on answer pattern?', 'When monotonic predicate over candidate values—check feasibility costing f(mid) amortized separates search space logarithmically despite evaluation sometimes heavy.'],
      ['Pivot rotated sorted array?', 'Shrink interval while nums[lo]<nums[mid] declares left sorted else right—compare target against sorted halves to discard half recursively.'],
    ],
  },
  {
    stem: 'Sorting & selection',
    pairs: [
      ['QuickSort average vs guaranteed worst?', 'Random pivot amortizes expected O(n log n) but deterministic bad pivots degrade to O(n²); introspective sort switches to heapsort tails in libraries.'],
      ['When radix sort beats comparison sorts?', 'Fixed-width integer keys bounded by alphabet size w—O(n·w) when w small vs comparison lower bound Ω(n log n).'],
      ['Median of medians?', 'Divide into groups of five, recurse medians, partition—guarantees linear-time selection underpinning deterministic pivot quickselect worst-case proofs.'],
    ],
  },
  {
    stem: 'System design lite',
    pairs: [
      ['CAP tradeoff gist?', 'During partition can’t simultaneously guarantee consistency and availability; systems pick CP (strong consistency outages) versus AP eventual consistency overlays.'],
      ['Idempotent POST importance?', 'Retries from clients or gateways replay requests; idempotent keys or duplicate detection tables avoid charging twice banking style operations.'],
      ['Rate limiting strategies?', 'Token bucket smoothes bursts leaky bucket smoothes averages; Redis sliding windows approximate distributed fairness with atomic Lua scripts or sorted sets pruning old timestamps.'],
    ],
  },
  {
    stem: 'Networking & HTTP',
    pairs: [
      ['Difference PUT vs PATCH semantics?', 'PUT replaces entire resource representations client supplies while PATCH conveys partial deltas; naive servers map PATCH poorly so document expectations.'],
      ['JWT structure & risks?', 'Header.payload.signature; verify signature/expiry server-side never trust client without rotation; stealing tokens equals session hijack prompting httpOnly rotating refresh tokens pair.'],
      ['WebSockets vs SSE?', 'SSE one-way streaming over HTTP simplicity with auto-reconnect; WebSockets duplex low-latency but stateful infra complexity—pick by directionality/interaction model.'],
    ],
  },
  {
    stem: 'Databases',
    pairs: [
      ['Normalization goals?', 'Reduce redundancy insertion/update anomalies via functional dependencies—typically to 3NF/Boyce-Codd at cost of joins denormalizing later for analytics.'],
      ['Indexing tradeoffs?', 'B-tree indexes accelerate reads/order but slow writes and occupy space; cardinality low columns benefit less selective indexes sometimes composite better.'],
      ['Serializable isolation vs snapshots?', 'Serializable prevents phantom reads via predicates locks or SSI anomalies tracking; snapshots allow readers non-blocking albeit stale bounded versions.'],
    ],
  },
  {
    stem: 'Operating systems',
    pairs: [
      ['Process versus thread?', 'Processes isolate memory maps crash-safe but costly context switches; threads share address space simplifying data sharing risking race hazards requiring synchronization primitives.'],
      [' Mutex vs semaphore?', 'Mutex binary ownership guarding critical section recursive unsafe unless typed; semaphore counts generalized resources permitting multiple holders without strict ownership concept.'],
      ['Virtual memory paging?', 'MMUs map virtual to physical frames page faults fetching disk backing store demand paging thrashes if working set exceeds RAM—replacement policies LRU approximations dominate.'],
    ],
  },
  {
    stem: 'JavaScript / TypeScript',
    pairs: [
      ['Explain event loop phases briefly?', 'Timers poll check microtasks promises before macrotasks; understanding ordering prevents starvation bugs sequencing await versus setImmediate in Node quirks.'],
      ['What closures capture?', 'Environment records binding outer lexical variables—even after outer function returns—impacting loops using var versus let iterators when scheduling callbacks.'],
      ['Structural typing VS nominal?', 'TypeScript aligns shapes implicitly unlike Java nominal classes—inference satisfied by duck typing simplifying adapters but weakening brand distinctions unless branded types pattern.'],
    ],
  },
  {
    stem: 'React',
    pairs: [
      ['Why concurrent rendering?', 'Lets React interrupt rendering for urgent updates yielding smoother UX by time-slicing work without forfeiving correctness guarded by suspense boundaries prioritization.'],
      ['useEffect cleanup purpose?', 'Unsubscribe timers abort controllers preventing memory leaks/state updates post-unmount when dependencies change rerun sequence cleanup-first then setup.'],
      ['Controlled vs uncontrolled inputs?', 'Controlled binds value to React state guaranteeing single source truth validation easy; uncontrolled relies refs/DOM bridging legacy forms migrating gradually.'],
    ],
  },
  {
    stem: 'Node.js backend',
    pairs: [
      ['Cluster module benefit?', 'Spawns worker processes sharing server port multiplying CPU-bound throughput while isolating faults—mind shared nothing except message passing clustering stateful sessions carefully.'],
      ['Stream backpressure?', 'Consumers signal pause/resume aligning producer speed avoiding RAM blowups piping fs read to gzip to network automatically coordinates via highWaterMark thresholds.'],
      ['Graceful shutdown steps?', 'Stop accepting sockets drain in-flight finalize DB pools notify orchestrator respecting SIGTERM chaining timeouts kill only if stuck.'],
    ],
  },
  {
    stem: 'Security basics',
    pairs: [
      ['CSRF defenses?', 'SameSite cookies tighten cross-site embedding plus anti-CSRF synchronizer tokens validating origin headers combos mitigating forged state-changing requests.'],
      ['Parameterized queries why?', 'Bind variables separate SQL structure from literals eliminating injection payloads constructing unintended statements—never interpolate raw inputs.'],
      ['OAuth vs JWT access tokens?', 'OAuth describes authorization delegation flows; bearer JWT often implements access tokens but refresh rotation and audience claims still paramount—don’t confuse protocol with transport.'],
    ],
  },
  {
    stem: 'Testing & CI',
    pairs: [
      ['Unit versus integration boundaries?', 'Unit isolates deterministic pure modules mocked dependencies fast; integration exercises real collaborators catching wiring failures slower flakiness risk climbs.'],
      ['Deterministic flaky test causes?', 'Leaky globals unsynchronized clocks shared mutable singleton race ordering—prefer hermetic sandbox fixtures resetting between tests clocks injection.'],
      ['Smoke versus regression suites?', 'Smoke shallow critical path validating deploy viability minutes; regression broad historical bug coverage nightly balancing signal versus duration tradeoffs pipelines.'],
    ],
  },
  {
    stem: 'Behavioral / STAR',
    pairs: [
      ['STAR format outline?', 'Situation/Task context sets stakes; Action specifics you drove; Results quantify outcomes showing metrics learning loops closing behavioral prompts cleanly.'],
      ['Discussing constructive conflict?', 'Emphasize data-driven dissent resolved via prototypes or escalation paths aligning stakeholders—avoid blame articulate compromise outcomes lessons codified afterward.'],
      ['Talking failure authentically?', 'Pick substantive miss describe detection mitigation prevention guardrails instituted demonstrating accountability growth—never faux perfection narratives.'],
    ],
  },
  {
    stem: 'Complexity intuition',
    pairs: [
      ['Amortized analysis intuition?', 'Occasional expensive operations prepaid by cheaper ones averaged over sequence—dynamic array doubling aggregated insertions remain O(1) amortized.'],
      ['Master theorem quick use?', 'Recurrences T(n)=a T(n/b)+f(n)—compare f(n) to n^(log_b a) regimes dominated by roots leaves or balanced driving Θ guesses for divide conquer.'],
      ['Difference Θ vs O casually stated?', 'O upper bound maybe loose; Ω lower; Θ simultaneous tight characterization—mentioning pure O hides best cases interview precision expects Θ clarifications known inputs.'],
    ],
  },
  {
    stem: 'Strings',
    pairs: [
      ['Why KMP amortized linear?', 'Failure function reuses comparisons skipping redundant retraces guaranteeing pointer on text advances monotonic total O(len).'],
      ['Rolling hash pitfalls?', 'Mod collisions choose double hashing large primes rerun verification substring equality brute confirm—birthday paradox still rare but nondeterministic failure guard.'],
      ['Unicode complexity interviewing?', 'Grapheme clusters surpass code points exceed bytes—iteration naive charAt breaks emoji sequences awareness internationalization regressions cropping.'],
    ],
  },
  {
    stem: 'Bit manipulation',
    pairs: [
      ['Isolate lowest set bit trick?', `n & -n leverages two complement isolating trailing 1 bitmask useful Fenwick iterating ancestors or counting 1-bits variations.`],
      ['XOR swap caveats?', 'Same memory alias corrupts swapping—also integer overflow misconceptions though XOR bitwise safe commutative reversible only distinct locations.'],
      ['Bitmask DP state encoding?', 'Subsets enumerated as ints width ≤20 typical travel salesman small n—checking membership O(1) toggles via bitwise ops transitions precomputed transitions.'],
    ],
  },
  {
    stem: 'Probability & hashing',
    pairs: [
      ['Bloom filters tradeoff?', 'Space-efficient memberships with configurable false-positive rate impossible deletions canonical unless counting variant—ideal caches negative lookups CDN edges.'],
      ['Birthday paradox hashing?', '~√N trials yield collision expectation guiding load factor thresholds rehash resizing birthday bound intuition bucketing churn.'],
      ['Monte Carlo vs Las Vegas?', 'Monte terminates fixed time approximate correctness probability; Las Vegas always correct expected bounded time randomized quicksort pivot randomized expected O(n log n).'],
    ],
  },
  {
    stem: 'API design',
    pairs: [
      ['Version REST APIs?', 'Path prefix /v1 stable breaking changes incremented document deprecations sunset headers sparing clients surprise contract tests guard migrations.'],
      ['Pagination cursors versus offsets?', 'Cursors resilient live mutating datasets avoid skipped duplicatesOffsets cheap static datasets simplistic—choose stability requirements first.'],
      ['Hypermedia tradeoffs?', 'HATEOAS embeds transitions discoverability improving evolvability but payloads heavier clients cache unfriendly pragmatic hybrids common.'],
    ],
  },
  {
    stem: 'Caching',
    pairs: [
      ['Cache stampedes mitigation?', 'Probabilistic early expiration stagger recompute TTL jitter locks singleflight consolidating thundering herds backend spikes.'],
      ['CDN cache invalidation strategies?', 'Versioned filenames immutable content long TTL versus purge APIs tagging surrogate keys selective bust—choose consistency vs freshness product tolerances.'],
      ['Memoization pitfalls React?', 'Referential instability dependencies cause redundant recalcs—memoize selectors with shallow compare aware concurrent rendering tearing stale closures.'],
    ],
  },
  {
    stem: 'Leadership & collaboration',
    pairs: [
      ['Prioritizing tech debt?', 'Frame impact/risk matrix quantifying incident frequency customer pain pairing incremental repayment SLAs aligning product increments transparently stakeholder trust.'],
      ['Giving code review feedback?', 'Ask clarifying assume good intent categorize blocking vs nit label severity pair suggestions rationale reference style guides escalate patterns not individuals.'],
      ['Remote async communication?', 'Document decisions searchable durable threads summaries decision logs reduce meetings bias written clarity aligns time zones politely.'],
    ],
  },
  {
    stem: 'Quality & craftsmanship',
    pairs: [
      ['Defensive programming?', 'Validate boundaries early fail fast assertions logging contexts returning typed errors simplifying caller reasoning secure defaults least privilege layering.'],
      ['Linting/formatting rationale?', 'Uniform diffs shrinking review noise automate bikeshed debates integrate pre-commit hooks CI enforcing zero-warning baselines creeping debt.'],
      ['Monitoring golden signals?', 'Latency traffic errors saturation underpin SLO thinking exemplified Google SRE pairing dashboards alerting actionable runbooks not vanity metrics alone.'],
    ],
  },
  {
    stem: 'Misc algorithms',
    pairs: [
      ['Dijkstra non-negative caveat?', 'Negative edges break greedy relaxation order requiring Bellman-Ford or Johnson reweighting preprocessing—mention usage boundaries interviews.'],
      ['Union-find optimizations?', 'Path compression union by rank amortized inverse Ackermann nearly constant practical connectivity Kruskal mst leverages ascending edge sort plus DSU merges.'],
      ['A* versus Dijkstra?', 'Heuristic guides search goal-directed admissible heuristics preserve optimality inflate inadmissible speeds approximate navigation games maps.'],
    ],
  },
  {
    stem: 'Edge cases mindset',
    pairs: [
      ['Empty input handling?', 'Zero-one element arrays often explode divide conquer recurrences—establish base cases proactively tests codifying regressions guarding off-by-one.'],
      ['Integer overflow awareness?', 'Languages silent wrap—promote long check before multiply addition competitive programming templates pattern multiply safe using bigger types modular tricks.'],
      ['Floating accuracy issues?', 'Equality unreliable tolerances eps comparisons financial decimal libraries avoid binary float artifacts aggregations currency.'],
    ],
  },
  {
    stem: 'Async patterns',
    pairs: [
      ['Promise.all vs allSettled?', 'all short-circuits first rejection; allSettled collects outcomes resilience partial success fan-out fan-in aggregations mix strategies.'],
      ['Backpressure async iterators?', 'for await respecting consumer speed pause upstream observables analogous streaming—uncoordinated buffering risks memory exhaustion asynchronous pipelines engineering.'],
      ['Race cancellation?', 'AbortController revoke fetch ReadableStream teardown cooperative cancellation patterns preventing zombie updates after navigations UX polish.'],
    ],
  },
  {
    stem: 'Product thinking',
    pairs: [
      ['MVP slicing question?', 'Identify smallest differentiable value hypothesis metrics proving demand before layering robustness aligning engineering bets validated learning minimizing waste.'],
      ['Technical debt communication?', 'Translate interest metaphor quantify drag velocity incidents frequency securing dedicated bandwidth negotiation reframing preventive maintenance ally not adversary PM.'],
      ['Instrumentation before optimization?', 'Profile representative workloads measure hotspots quantify improvements counter intuition premature micro optimizations hurting readability without evidence.'],
    ],
  },
  {
    stem: 'Distributed basics',
    pairs: [
      ['Exactly-once semantics reality?', 'True exactly-once impossible across networks—idempotent sinks plus at-least-once delivery dedup approximate practical Kafka transactions caveats educating stakeholders.'],
      ['Vector clocks purpose?', 'Capture partial ordering events replicas resolving conflicts CRDTs alternative families automatic merge choosing domain-specific resolution policies.'],
      ['Split brain mitigation?', 'Quorum majorities fencing tokens prevent stale primaries writing storage epoch negotiation dynamic cluster membership consensus raft/paxos families.'],
    ],
  },
  {
    stem: 'Mobile / web perf',
    pairs: [
      ['Critical rendering path?', 'Minimize blocking CSS/JS leverage preload preconnect responsive images priority hints improving LCP CLS metrics user perceived performance budgets.'],
      ['Image optimization strategies?', 'Responsive srcset modern formats AVIF/WebP CDN adaptive quality lazy below fold differentiate art direction breakpoints.'],
      ['Service worker caching?', 'Cache-first network-first strategies choosing stale-while-revalidate offline resilience precaching versioning bump bust migrations careful size caps.'],
    ],
  },
  {
    stem: 'Career narrative',
    pairs: [
      ['Why this company answer skeleton?', 'Tie mission personal story craft depth evidence research authentic curiosity avoid generic flattery demonstrate informed excitement role-specific impact vision.'],
      ['Salary expectation deflection?', 'Pivot market research ranges flexibility total compensation components learning growth framing collaborative tone inviting reciprocity gathering data first sometimes.'],
      ['Questions for interviewer?', 'Team dynamics on-call culture technical debt tolerance growth paths signal maturity genuine interest conversation balance evaluative versus interrogative tone.'],
    ],
  },
];

const items = [];
let id = 1;
for (const topic of topics) {
  for (const [q, a] of topic.pairs) {
    items.push({
      id: id++,
      category: topic.stem,
      question: q,
      answer: a,
    });
  }
}

const slim = items.slice(0, 100).map((it, i) => ({
  ...it,
  id: i + 1,
}));

const out = `/* eslint-disable prettier/prettier */
/** Auto-generated by scripts/generateInterviewFaqs.mjs — 100 FAQs */
export type InterviewFaq = { id: number; category: string; question: string; answer: string };

export const INTERVIEW_FAQS: InterviewFaq[] = ${JSON.stringify(slim, null, 2)};
`;

const target = path.join(root, 'src', 'data', 'interviewFaqs.ts');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out, 'utf8');
console.log('Wrote', target, slim.length);

