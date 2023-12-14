'use strict';
var Ji = Object.create;
var wr = Object.defineProperty;
var Xi = Object.getOwnPropertyDescriptor;
var Zi = Object.getOwnPropertyNames;
var eo = Object.getPrototypeOf,
  to = Object.prototype.hasOwnProperty;
var P = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
var ro = (t, e, r, n) => {
  if ((e && typeof e == 'object') || typeof e == 'function')
    for (let s of Zi(e))
      !to.call(t, s) && s !== r && wr(t, s, { get: () => e[s], enumerable: !(n = Xi(e, s)) || n.enumerable });
  return t;
};
var ne = (t, e, r) => (
  (r = t != null ? Ji(eo(t)) : {}), ro(e || !t || !t.__esModule ? wr(r, 'default', { value: t, enumerable: !0 }) : r, t)
);
var ve = P((mt) => {
  var Me = class extends Error {
      constructor(e, r, n) {
        super(n),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name),
          (this.code = r),
          (this.exitCode = e),
          (this.nestedError = void 0);
      }
    },
    pt = class extends Me {
      constructor(e) {
        super(1, 'commander.invalidArgument', e),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name);
      }
    };
  mt.CommanderError = Me;
  mt.InvalidArgumentError = pt;
});
var De = P((gt) => {
  var { InvalidArgumentError: no } = ve(),
    dt = class {
      constructor(e, r) {
        switch (
          ((this.description = r || ''),
          (this.variadic = !1),
          (this.parseArg = void 0),
          (this.defaultValue = void 0),
          (this.defaultValueDescription = void 0),
          (this.argChoices = void 0),
          e[0])
        ) {
          case '<':
            (this.required = !0), (this._name = e.slice(1, -1));
            break;
          case '[':
            (this.required = !1), (this._name = e.slice(1, -1));
            break;
          default:
            (this.required = !0), (this._name = e);
            break;
        }
        this._name.length > 3 &&
          this._name.slice(-3) === '...' &&
          ((this.variadic = !0), (this._name = this._name.slice(0, -3)));
      }
      name() {
        return this._name;
      }
      _concatValue(e, r) {
        return r === this.defaultValue || !Array.isArray(r) ? [e] : r.concat(e);
      }
      default(e, r) {
        return (this.defaultValue = e), (this.defaultValueDescription = r), this;
      }
      argParser(e) {
        return (this.parseArg = e), this;
      }
      choices(e) {
        return (
          (this.argChoices = e.slice()),
          (this.parseArg = (r, n) => {
            if (!this.argChoices.includes(r)) throw new no(`Allowed choices are ${this.argChoices.join(', ')}.`);
            return this.variadic ? this._concatValue(r, n) : r;
          }),
          this
        );
      }
      argRequired() {
        return (this.required = !0), this;
      }
      argOptional() {
        return (this.required = !1), this;
      }
    };
  function so(t) {
    let e = t.name() + (t.variadic === !0 ? '...' : '');
    return t.required ? '<' + e + '>' : '[' + e + ']';
  }
  gt.Argument = dt;
  gt.humanReadableArgName = so;
});
var bt = P((Or) => {
  var { humanReadableArgName: io } = De(),
    _t = class {
      constructor() {
        (this.helpWidth = void 0), (this.sortSubcommands = !1), (this.sortOptions = !1), (this.showGlobalOptions = !1);
      }
      visibleCommands(e) {
        let r = e.commands.filter((n) => !n._hidden);
        if (e._hasImplicitHelpCommand()) {
          let [, n, s] = e._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/),
            i = e.createCommand(n).helpOption(!1);
          i.description(e._helpCommandDescription), s && i.arguments(s), r.push(i);
        }
        return this.sortSubcommands && r.sort((n, s) => n.name().localeCompare(s.name())), r;
      }
      compareOptions(e, r) {
        let n = (s) => (s.short ? s.short.replace(/^-/, '') : s.long.replace(/^--/, ''));
        return n(e).localeCompare(n(r));
      }
      visibleOptions(e) {
        let r = e.options.filter((i) => !i.hidden),
          n = e._hasHelpOption && e._helpShortFlag && !e._findOption(e._helpShortFlag),
          s = e._hasHelpOption && !e._findOption(e._helpLongFlag);
        if (n || s) {
          let i;
          n
            ? s
              ? (i = e.createOption(e._helpFlags, e._helpDescription))
              : (i = e.createOption(e._helpShortFlag, e._helpDescription))
            : (i = e.createOption(e._helpLongFlag, e._helpDescription)),
            r.push(i);
        }
        return this.sortOptions && r.sort(this.compareOptions), r;
      }
      visibleGlobalOptions(e) {
        if (!this.showGlobalOptions) return [];
        let r = [];
        for (let n = e.parent; n; n = n.parent) {
          let s = n.options.filter((i) => !i.hidden);
          r.push(...s);
        }
        return this.sortOptions && r.sort(this.compareOptions), r;
      }
      visibleArguments(e) {
        return (
          e._argsDescription &&
            e.registeredArguments.forEach((r) => {
              r.description = r.description || e._argsDescription[r.name()] || '';
            }),
          e.registeredArguments.find((r) => r.description) ? e.registeredArguments : []
        );
      }
      subcommandTerm(e) {
        let r = e.registeredArguments.map((n) => io(n)).join(' ');
        return (
          e._name +
          (e._aliases[0] ? '|' + e._aliases[0] : '') +
          (e.options.length ? ' [options]' : '') +
          (r ? ' ' + r : '')
        );
      }
      optionTerm(e) {
        return e.flags;
      }
      argumentTerm(e) {
        return e.name();
      }
      longestSubcommandTermLength(e, r) {
        return r.visibleCommands(e).reduce((n, s) => Math.max(n, r.subcommandTerm(s).length), 0);
      }
      longestOptionTermLength(e, r) {
        return r.visibleOptions(e).reduce((n, s) => Math.max(n, r.optionTerm(s).length), 0);
      }
      longestGlobalOptionTermLength(e, r) {
        return r.visibleGlobalOptions(e).reduce((n, s) => Math.max(n, r.optionTerm(s).length), 0);
      }
      longestArgumentTermLength(e, r) {
        return r.visibleArguments(e).reduce((n, s) => Math.max(n, r.argumentTerm(s).length), 0);
      }
      commandUsage(e) {
        let r = e._name;
        e._aliases[0] && (r = r + '|' + e._aliases[0]);
        let n = '';
        for (let s = e.parent; s; s = s.parent) n = s.name() + ' ' + n;
        return n + r + ' ' + e.usage();
      }
      commandDescription(e) {
        return e.description();
      }
      subcommandDescription(e) {
        return e.summary() || e.description();
      }
      optionDescription(e) {
        let r = [];
        return (
          e.argChoices && r.push(`choices: ${e.argChoices.map((n) => JSON.stringify(n)).join(', ')}`),
          e.defaultValue !== void 0 &&
            (e.required || e.optional || (e.isBoolean() && typeof e.defaultValue == 'boolean')) &&
            r.push(`default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`),
          e.presetArg !== void 0 && e.optional && r.push(`preset: ${JSON.stringify(e.presetArg)}`),
          e.envVar !== void 0 && r.push(`env: ${e.envVar}`),
          r.length > 0 ? `${e.description} (${r.join(', ')})` : e.description
        );
      }
      argumentDescription(e) {
        let r = [];
        if (
          (e.argChoices && r.push(`choices: ${e.argChoices.map((n) => JSON.stringify(n)).join(', ')}`),
          e.defaultValue !== void 0 &&
            r.push(`default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`),
          r.length > 0)
        ) {
          let n = `(${r.join(', ')})`;
          return e.description ? `${e.description} ${n}` : n;
        }
        return e.description;
      }
      formatHelp(e, r) {
        let n = r.padWidth(e, r),
          s = r.helpWidth || 80,
          i = 2,
          o = 2;
        function a(v, S) {
          if (S) {
            let F = `${v.padEnd(n + o)}${S}`;
            return r.wrap(F, s - i, n + o);
          }
          return v;
        }
        function u(v) {
          return v
            .join(
              `
`
            )
            .replace(/^/gm, ' '.repeat(i));
        }
        let c = [`Usage: ${r.commandUsage(e)}`, ''],
          l = r.commandDescription(e);
        l.length > 0 && (c = c.concat([r.wrap(l, s, 0), '']));
        let h = r.visibleArguments(e).map((v) => a(r.argumentTerm(v), r.argumentDescription(v)));
        h.length > 0 && (c = c.concat(['Arguments:', u(h), '']));
        let m = r.visibleOptions(e).map((v) => a(r.optionTerm(v), r.optionDescription(v)));
        if ((m.length > 0 && (c = c.concat(['Options:', u(m), ''])), this.showGlobalOptions)) {
          let v = r.visibleGlobalOptions(e).map((S) => a(r.optionTerm(S), r.optionDescription(S)));
          v.length > 0 && (c = c.concat(['Global Options:', u(v), '']));
        }
        let d = r.visibleCommands(e).map((v) => a(r.subcommandTerm(v), r.subcommandDescription(v)));
        return (
          d.length > 0 && (c = c.concat(['Commands:', u(d), ''])),
          c.join(`
`)
        );
      }
      padWidth(e, r) {
        return Math.max(
          r.longestOptionTermLength(e, r),
          r.longestGlobalOptionTermLength(e, r),
          r.longestSubcommandTermLength(e, r),
          r.longestArgumentTermLength(e, r)
        );
      }
      wrap(e, r, n, s = 40) {
        let i = ' \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF',
          o = new RegExp(`[\\n][${i}]+`);
        if (e.match(o)) return e;
        let a = r - n;
        if (a < s) return e;
        let u = e.slice(0, n),
          c = e.slice(n).replace(
            `\r
`,
            `
`
          ),
          l = ' '.repeat(n),
          m = '\\s\u200B',
          d = new RegExp(
            `
|.{1,${a - 1}}([${m}]|$)|[^${m}]+?([${m}]|$)`,
            'g'
          ),
          v = c.match(d) || [];
        return (
          u +
          v.map((S, F) =>
            S ===
            `
`
              ? ''
              : (F > 0 ? l : '') + S.trimEnd()
          ).join(`
`)
        );
      }
    };
  Or.Help = _t;
});
var kt = P((Ie) => {
  var { InvalidArgumentError: oo } = ve(),
    yt = class {
      constructor(e, r) {
        (this.flags = e),
          (this.description = r || ''),
          (this.required = e.includes('<')),
          (this.optional = e.includes('[')),
          (this.variadic = /\w\.\.\.[>\]]$/.test(e)),
          (this.mandatory = !1);
        let n = Tr(e);
        (this.short = n.shortFlag),
          (this.long = n.longFlag),
          (this.negate = !1),
          this.long && (this.negate = this.long.startsWith('--no-')),
          (this.defaultValue = void 0),
          (this.defaultValueDescription = void 0),
          (this.presetArg = void 0),
          (this.envVar = void 0),
          (this.parseArg = void 0),
          (this.hidden = !1),
          (this.argChoices = void 0),
          (this.conflictsWith = []),
          (this.implied = void 0);
      }
      default(e, r) {
        return (this.defaultValue = e), (this.defaultValueDescription = r), this;
      }
      preset(e) {
        return (this.presetArg = e), this;
      }
      conflicts(e) {
        return (this.conflictsWith = this.conflictsWith.concat(e)), this;
      }
      implies(e) {
        let r = e;
        return typeof e == 'string' && (r = { [e]: !0 }), (this.implied = Object.assign(this.implied || {}, r)), this;
      }
      env(e) {
        return (this.envVar = e), this;
      }
      argParser(e) {
        return (this.parseArg = e), this;
      }
      makeOptionMandatory(e = !0) {
        return (this.mandatory = !!e), this;
      }
      hideHelp(e = !0) {
        return (this.hidden = !!e), this;
      }
      _concatValue(e, r) {
        return r === this.defaultValue || !Array.isArray(r) ? [e] : r.concat(e);
      }
      choices(e) {
        return (
          (this.argChoices = e.slice()),
          (this.parseArg = (r, n) => {
            if (!this.argChoices.includes(r)) throw new oo(`Allowed choices are ${this.argChoices.join(', ')}.`);
            return this.variadic ? this._concatValue(r, n) : r;
          }),
          this
        );
      }
      name() {
        return this.long ? this.long.replace(/^--/, '') : this.short.replace(/^-/, '');
      }
      attributeName() {
        return ao(this.name().replace(/^no-/, ''));
      }
      is(e) {
        return this.short === e || this.long === e;
      }
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    },
    vt = class {
      constructor(e) {
        (this.positiveOptions = new Map()),
          (this.negativeOptions = new Map()),
          (this.dualOptions = new Set()),
          e.forEach((r) => {
            r.negate ? this.negativeOptions.set(r.attributeName(), r) : this.positiveOptions.set(r.attributeName(), r);
          }),
          this.negativeOptions.forEach((r, n) => {
            this.positiveOptions.has(n) && this.dualOptions.add(n);
          });
      }
      valueFromOption(e, r) {
        let n = r.attributeName();
        if (!this.dualOptions.has(n)) return !0;
        let s = this.negativeOptions.get(n).presetArg,
          i = s !== void 0 ? s : !1;
        return r.negate === (i === e);
      }
    };
  function ao(t) {
    return t.split('-').reduce((e, r) => e + r[0].toUpperCase() + r.slice(1));
  }
  function Tr(t) {
    let e,
      r,
      n = t.split(/[ |,]+/);
    return (
      n.length > 1 && !/^[[<]/.test(n[1]) && (e = n.shift()),
      (r = n.shift()),
      !e && /^-[^-]$/.test(r) && ((e = r), (r = void 0)),
      { shortFlag: e, longFlag: r }
    );
  }
  Ie.Option = yt;
  Ie.splitOptionFlags = Tr;
  Ie.DualOptions = vt;
});
var Sr = P((Ar) => {
  function uo(t, e) {
    if (Math.abs(t.length - e.length) > 3) return Math.max(t.length, e.length);
    let r = [];
    for (let n = 0; n <= t.length; n++) r[n] = [n];
    for (let n = 0; n <= e.length; n++) r[0][n] = n;
    for (let n = 1; n <= e.length; n++)
      for (let s = 1; s <= t.length; s++) {
        let i = 1;
        t[s - 1] === e[n - 1] ? (i = 0) : (i = 1),
          (r[s][n] = Math.min(r[s - 1][n] + 1, r[s][n - 1] + 1, r[s - 1][n - 1] + i)),
          s > 1 &&
            n > 1 &&
            t[s - 1] === e[n - 2] &&
            t[s - 2] === e[n - 1] &&
            (r[s][n] = Math.min(r[s][n], r[s - 2][n - 2] + 1));
      }
    return r[t.length][e.length];
  }
  function co(t, e) {
    if (!e || e.length === 0) return '';
    e = Array.from(new Set(e));
    let r = t.startsWith('--');
    r && ((t = t.slice(2)), (e = e.map((o) => o.slice(2))));
    let n = [],
      s = 3,
      i = 0.4;
    return (
      e.forEach((o) => {
        if (o.length <= 1) return;
        let a = uo(t, o),
          u = Math.max(t.length, o.length);
        (u - a) / u > i && (a < s ? ((s = a), (n = [o])) : a === s && n.push(o));
      }),
      n.sort((o, a) => o.localeCompare(a)),
      r && (n = n.map((o) => `--${o}`)),
      n.length > 1
        ? `
(Did you mean one of ${n.join(', ')}?)`
        : n.length === 1
        ? `
(Did you mean ${n[0]}?)`
        : ''
    );
  }
  Ar.suggestSimilar = co;
});
var $r = P((Pr) => {
  var lo = require('events').EventEmitter,
    Ct = require('child_process'),
    Y = require('path'),
    wt = require('fs'),
    w = require('process'),
    { Argument: ho, humanReadableArgName: fo } = De(),
    { CommanderError: Ot } = ve(),
    { Help: po } = bt(),
    { Option: Er, splitOptionFlags: mo, DualOptions: go } = kt(),
    { suggestSimilar: xr } = Sr(),
    Tt = class t extends lo {
      constructor(e) {
        super(),
          (this.commands = []),
          (this.options = []),
          (this.parent = null),
          (this._allowUnknownOption = !1),
          (this._allowExcessArguments = !0),
          (this.registeredArguments = []),
          (this._args = this.registeredArguments),
          (this.args = []),
          (this.rawArgs = []),
          (this.processedArgs = []),
          (this._scriptPath = null),
          (this._name = e || ''),
          (this._optionValues = {}),
          (this._optionValueSources = {}),
          (this._storeOptionsAsProperties = !1),
          (this._actionHandler = null),
          (this._executableHandler = !1),
          (this._executableFile = null),
          (this._executableDir = null),
          (this._defaultCommandName = null),
          (this._exitCallback = null),
          (this._aliases = []),
          (this._combineFlagAndOptionalValue = !0),
          (this._description = ''),
          (this._summary = ''),
          (this._argsDescription = void 0),
          (this._enablePositionalOptions = !1),
          (this._passThroughOptions = !1),
          (this._lifeCycleHooks = {}),
          (this._showHelpAfterError = !1),
          (this._showSuggestionAfterError = !0),
          (this._outputConfiguration = {
            writeOut: (r) => w.stdout.write(r),
            writeErr: (r) => w.stderr.write(r),
            getOutHelpWidth: () => (w.stdout.isTTY ? w.stdout.columns : void 0),
            getErrHelpWidth: () => (w.stderr.isTTY ? w.stderr.columns : void 0),
            outputError: (r, n) => n(r),
          }),
          (this._hidden = !1),
          (this._hasHelpOption = !0),
          (this._helpFlags = '-h, --help'),
          (this._helpDescription = 'display help for command'),
          (this._helpShortFlag = '-h'),
          (this._helpLongFlag = '--help'),
          (this._addImplicitHelpCommand = void 0),
          (this._helpCommandName = 'help'),
          (this._helpCommandnameAndArgs = 'help [command]'),
          (this._helpCommandDescription = 'display help for command'),
          (this._helpConfiguration = {});
      }
      copyInheritedSettings(e) {
        return (
          (this._outputConfiguration = e._outputConfiguration),
          (this._hasHelpOption = e._hasHelpOption),
          (this._helpFlags = e._helpFlags),
          (this._helpDescription = e._helpDescription),
          (this._helpShortFlag = e._helpShortFlag),
          (this._helpLongFlag = e._helpLongFlag),
          (this._helpCommandName = e._helpCommandName),
          (this._helpCommandnameAndArgs = e._helpCommandnameAndArgs),
          (this._helpCommandDescription = e._helpCommandDescription),
          (this._helpConfiguration = e._helpConfiguration),
          (this._exitCallback = e._exitCallback),
          (this._storeOptionsAsProperties = e._storeOptionsAsProperties),
          (this._combineFlagAndOptionalValue = e._combineFlagAndOptionalValue),
          (this._allowExcessArguments = e._allowExcessArguments),
          (this._enablePositionalOptions = e._enablePositionalOptions),
          (this._showHelpAfterError = e._showHelpAfterError),
          (this._showSuggestionAfterError = e._showSuggestionAfterError),
          this
        );
      }
      _getCommandAndAncestors() {
        let e = [];
        for (let r = this; r; r = r.parent) e.push(r);
        return e;
      }
      command(e, r, n) {
        let s = r,
          i = n;
        typeof s == 'object' && s !== null && ((i = s), (s = null)), (i = i || {});
        let [, o, a] = e.match(/([^ ]+) *(.*)/),
          u = this.createCommand(o);
        return (
          s && (u.description(s), (u._executableHandler = !0)),
          i.isDefault && (this._defaultCommandName = u._name),
          (u._hidden = !!(i.noHelp || i.hidden)),
          (u._executableFile = i.executableFile || null),
          a && u.arguments(a),
          this.commands.push(u),
          (u.parent = this),
          u.copyInheritedSettings(this),
          s ? this : u
        );
      }
      createCommand(e) {
        return new t(e);
      }
      createHelp() {
        return Object.assign(new po(), this.configureHelp());
      }
      configureHelp(e) {
        return e === void 0 ? this._helpConfiguration : ((this._helpConfiguration = e), this);
      }
      configureOutput(e) {
        return e === void 0 ? this._outputConfiguration : (Object.assign(this._outputConfiguration, e), this);
      }
      showHelpAfterError(e = !0) {
        return typeof e != 'string' && (e = !!e), (this._showHelpAfterError = e), this;
      }
      showSuggestionAfterError(e = !0) {
        return (this._showSuggestionAfterError = !!e), this;
      }
      addCommand(e, r) {
        if (!e._name)
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        return (
          (r = r || {}),
          r.isDefault && (this._defaultCommandName = e._name),
          (r.noHelp || r.hidden) && (e._hidden = !0),
          this.commands.push(e),
          (e.parent = this),
          this
        );
      }
      createArgument(e, r) {
        return new ho(e, r);
      }
      argument(e, r, n, s) {
        let i = this.createArgument(e, r);
        return typeof n == 'function' ? i.default(s).argParser(n) : i.default(n), this.addArgument(i), this;
      }
      arguments(e) {
        return (
          e
            .trim()
            .split(/ +/)
            .forEach((r) => {
              this.argument(r);
            }),
          this
        );
      }
      addArgument(e) {
        let r = this.registeredArguments.slice(-1)[0];
        if (r && r.variadic) throw new Error(`only the last argument can be variadic '${r.name()}'`);
        if (e.required && e.defaultValue !== void 0 && e.parseArg === void 0)
          throw new Error(`a default value for a required argument is never used: '${e.name()}'`);
        return this.registeredArguments.push(e), this;
      }
      addHelpCommand(e, r) {
        return (
          e === !1
            ? (this._addImplicitHelpCommand = !1)
            : ((this._addImplicitHelpCommand = !0),
              typeof e == 'string' && ((this._helpCommandName = e.split(' ')[0]), (this._helpCommandnameAndArgs = e)),
              (this._helpCommandDescription = r || this._helpCommandDescription)),
          this
        );
      }
      _hasImplicitHelpCommand() {
        return this._addImplicitHelpCommand === void 0
          ? this.commands.length && !this._actionHandler && !this._findCommand('help')
          : this._addImplicitHelpCommand;
      }
      hook(e, r) {
        let n = ['preSubcommand', 'preAction', 'postAction'];
        if (!n.includes(e))
          throw new Error(`Unexpected value for event passed to hook : '${e}'.
Expecting one of '${n.join("', '")}'`);
        return this._lifeCycleHooks[e] ? this._lifeCycleHooks[e].push(r) : (this._lifeCycleHooks[e] = [r]), this;
      }
      exitOverride(e) {
        return (
          e
            ? (this._exitCallback = e)
            : (this._exitCallback = (r) => {
                if (r.code !== 'commander.executeSubCommandAsync') throw r;
              }),
          this
        );
      }
      _exit(e, r, n) {
        this._exitCallback && this._exitCallback(new Ot(e, r, n)), w.exit(e);
      }
      action(e) {
        let r = (n) => {
          let s = this.registeredArguments.length,
            i = n.slice(0, s);
          return this._storeOptionsAsProperties ? (i[s] = this) : (i[s] = this.opts()), i.push(this), e.apply(this, i);
        };
        return (this._actionHandler = r), this;
      }
      createOption(e, r) {
        return new Er(e, r);
      }
      _callParseArg(e, r, n, s) {
        try {
          return e.parseArg(r, n);
        } catch (i) {
          if (i.code === 'commander.invalidArgument') {
            let o = `${s} ${i.message}`;
            this.error(o, { exitCode: i.exitCode, code: i.code });
          }
          throw i;
        }
      }
      addOption(e) {
        let r = e.name(),
          n = e.attributeName();
        if (e.negate) {
          let i = e.long.replace(/^--no-/, '--');
          this._findOption(i) ||
            this.setOptionValueWithSource(n, e.defaultValue === void 0 ? !0 : e.defaultValue, 'default');
        } else e.defaultValue !== void 0 && this.setOptionValueWithSource(n, e.defaultValue, 'default');
        this.options.push(e);
        let s = (i, o, a) => {
          i == null && e.presetArg !== void 0 && (i = e.presetArg);
          let u = this.getOptionValue(n);
          i !== null && e.parseArg
            ? (i = this._callParseArg(e, i, u, o))
            : i !== null && e.variadic && (i = e._concatValue(i, u)),
            i == null && (e.negate ? (i = !1) : e.isBoolean() || e.optional ? (i = !0) : (i = '')),
            this.setOptionValueWithSource(n, i, a);
        };
        return (
          this.on('option:' + r, (i) => {
            let o = `error: option '${e.flags}' argument '${i}' is invalid.`;
            s(i, o, 'cli');
          }),
          e.envVar &&
            this.on('optionEnv:' + r, (i) => {
              let o = `error: option '${e.flags}' value '${i}' from env '${e.envVar}' is invalid.`;
              s(i, o, 'env');
            }),
          this
        );
      }
      _optionEx(e, r, n, s, i) {
        if (typeof r == 'object' && r instanceof Er)
          throw new Error('To add an Option object use addOption() instead of option() or requiredOption()');
        let o = this.createOption(r, n);
        if ((o.makeOptionMandatory(!!e.mandatory), typeof s == 'function')) o.default(i).argParser(s);
        else if (s instanceof RegExp) {
          let a = s;
          (s = (u, c) => {
            let l = a.exec(u);
            return l ? l[0] : c;
          }),
            o.default(i).argParser(s);
        } else o.default(s);
        return this.addOption(o);
      }
      option(e, r, n, s) {
        return this._optionEx({}, e, r, n, s);
      }
      requiredOption(e, r, n, s) {
        return this._optionEx({ mandatory: !0 }, e, r, n, s);
      }
      combineFlagAndOptionalValue(e = !0) {
        return (this._combineFlagAndOptionalValue = !!e), this;
      }
      allowUnknownOption(e = !0) {
        return (this._allowUnknownOption = !!e), this;
      }
      allowExcessArguments(e = !0) {
        return (this._allowExcessArguments = !!e), this;
      }
      enablePositionalOptions(e = !0) {
        return (this._enablePositionalOptions = !!e), this;
      }
      passThroughOptions(e = !0) {
        if (((this._passThroughOptions = !!e), this.parent && e && !this.parent._enablePositionalOptions))
          throw new Error(
            'passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)'
          );
        return this;
      }
      storeOptionsAsProperties(e = !0) {
        if (this.options.length) throw new Error('call .storeOptionsAsProperties() before adding options');
        return (this._storeOptionsAsProperties = !!e), this;
      }
      getOptionValue(e) {
        return this._storeOptionsAsProperties ? this[e] : this._optionValues[e];
      }
      setOptionValue(e, r) {
        return this.setOptionValueWithSource(e, r, void 0);
      }
      setOptionValueWithSource(e, r, n) {
        return (
          this._storeOptionsAsProperties ? (this[e] = r) : (this._optionValues[e] = r),
          (this._optionValueSources[e] = n),
          this
        );
      }
      getOptionValueSource(e) {
        return this._optionValueSources[e];
      }
      getOptionValueSourceWithGlobals(e) {
        let r;
        return (
          this._getCommandAndAncestors().forEach((n) => {
            n.getOptionValueSource(e) !== void 0 && (r = n.getOptionValueSource(e));
          }),
          r
        );
      }
      _prepareUserArgs(e, r) {
        if (e !== void 0 && !Array.isArray(e)) throw new Error('first parameter to parse must be array or undefined');
        (r = r || {}),
          e === void 0 && ((e = w.argv), w.versions && w.versions.electron && (r.from = 'electron')),
          (this.rawArgs = e.slice());
        let n;
        switch (r.from) {
          case void 0:
          case 'node':
            (this._scriptPath = e[1]), (n = e.slice(2));
            break;
          case 'electron':
            w.defaultApp ? ((this._scriptPath = e[1]), (n = e.slice(2))) : (n = e.slice(1));
            break;
          case 'user':
            n = e.slice(0);
            break;
          default:
            throw new Error(`unexpected parse option { from: '${r.from}' }`);
        }
        return (
          !this._name && this._scriptPath && this.nameFromFilename(this._scriptPath),
          (this._name = this._name || 'program'),
          n
        );
      }
      parse(e, r) {
        let n = this._prepareUserArgs(e, r);
        return this._parseCommand([], n), this;
      }
      async parseAsync(e, r) {
        let n = this._prepareUserArgs(e, r);
        return await this._parseCommand([], n), this;
      }
      _executeSubCommand(e, r) {
        r = r.slice();
        let n = !1,
          s = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
        function i(l, h) {
          let m = Y.resolve(l, h);
          if (wt.existsSync(m)) return m;
          if (s.includes(Y.extname(h))) return;
          let d = s.find((v) => wt.existsSync(`${m}${v}`));
          if (d) return `${m}${d}`;
        }
        this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
        let o = e._executableFile || `${this._name}-${e._name}`,
          a = this._executableDir || '';
        if (this._scriptPath) {
          let l;
          try {
            l = wt.realpathSync(this._scriptPath);
          } catch {
            l = this._scriptPath;
          }
          a = Y.resolve(Y.dirname(l), a);
        }
        if (a) {
          let l = i(a, o);
          if (!l && !e._executableFile && this._scriptPath) {
            let h = Y.basename(this._scriptPath, Y.extname(this._scriptPath));
            h !== this._name && (l = i(a, `${h}-${e._name}`));
          }
          o = l || o;
        }
        n = s.includes(Y.extname(o));
        let u;
        w.platform !== 'win32'
          ? n
            ? (r.unshift(o), (r = Rr(w.execArgv).concat(r)), (u = Ct.spawn(w.argv[0], r, { stdio: 'inherit' })))
            : (u = Ct.spawn(o, r, { stdio: 'inherit' }))
          : (r.unshift(o), (r = Rr(w.execArgv).concat(r)), (u = Ct.spawn(w.execPath, r, { stdio: 'inherit' }))),
          u.killed ||
            ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'].forEach((h) => {
              w.on(h, () => {
                u.killed === !1 && u.exitCode === null && u.kill(h);
              });
            });
        let c = this._exitCallback;
        c
          ? u.on('close', () => {
              c(new Ot(w.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
            })
          : u.on('close', w.exit.bind(w)),
          u.on('error', (l) => {
            if (l.code === 'ENOENT') {
              let h = a
                  ? `searched for local subcommand relative to directory '${a}'`
                  : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory',
                m = `'${o}' does not exist
 - if '${e._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${h}`;
              throw new Error(m);
            } else if (l.code === 'EACCES') throw new Error(`'${o}' not executable`);
            if (!c) w.exit(1);
            else {
              let h = new Ot(1, 'commander.executeSubCommandAsync', '(error)');
              (h.nestedError = l), c(h);
            }
          }),
          (this.runningCommand = u);
      }
      _dispatchSubcommand(e, r, n) {
        let s = this._findCommand(e);
        s || this.help({ error: !0 });
        let i;
        return (
          (i = this._chainOrCallSubCommandHook(i, s, 'preSubcommand')),
          (i = this._chainOrCall(i, () => {
            if (s._executableHandler) this._executeSubCommand(s, r.concat(n));
            else return s._parseCommand(r, n);
          })),
          i
        );
      }
      _dispatchHelpCommand(e) {
        e || this.help();
        let r = this._findCommand(e);
        return (
          r && !r._executableHandler && r.help(),
          this._dispatchSubcommand(e, [], [this._helpLongFlag || this._helpShortFlag])
        );
      }
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((e, r) => {
          e.required && this.args[r] == null && this.missingArgument(e.name());
        }),
          !(
            this.registeredArguments.length > 0 &&
            this.registeredArguments[this.registeredArguments.length - 1].variadic
          ) &&
            this.args.length > this.registeredArguments.length &&
            this._excessArguments(this.args);
      }
      _processArguments() {
        let e = (n, s, i) => {
          let o = s;
          if (s !== null && n.parseArg) {
            let a = `error: command-argument value '${s}' is invalid for argument '${n.name()}'.`;
            o = this._callParseArg(n, s, i, a);
          }
          return o;
        };
        this._checkNumberOfArguments();
        let r = [];
        this.registeredArguments.forEach((n, s) => {
          let i = n.defaultValue;
          n.variadic
            ? s < this.args.length
              ? ((i = this.args.slice(s)), n.parseArg && (i = i.reduce((o, a) => e(n, a, o), n.defaultValue)))
              : i === void 0 && (i = [])
            : s < this.args.length && ((i = this.args[s]), n.parseArg && (i = e(n, i, n.defaultValue))),
            (r[s] = i);
        }),
          (this.processedArgs = r);
      }
      _chainOrCall(e, r) {
        return e && e.then && typeof e.then == 'function' ? e.then(() => r()) : r();
      }
      _chainOrCallHooks(e, r) {
        let n = e,
          s = [];
        return (
          this._getCommandAndAncestors()
            .reverse()
            .filter((i) => i._lifeCycleHooks[r] !== void 0)
            .forEach((i) => {
              i._lifeCycleHooks[r].forEach((o) => {
                s.push({ hookedCommand: i, callback: o });
              });
            }),
          r === 'postAction' && s.reverse(),
          s.forEach((i) => {
            n = this._chainOrCall(n, () => i.callback(i.hookedCommand, this));
          }),
          n
        );
      }
      _chainOrCallSubCommandHook(e, r, n) {
        let s = e;
        return (
          this._lifeCycleHooks[n] !== void 0 &&
            this._lifeCycleHooks[n].forEach((i) => {
              s = this._chainOrCall(s, () => i(this, r));
            }),
          s
        );
      }
      _parseCommand(e, r) {
        let n = this.parseOptions(r);
        if (
          (this._parseOptionsEnv(),
          this._parseOptionsImplied(),
          (e = e.concat(n.operands)),
          (r = n.unknown),
          (this.args = e.concat(r)),
          e && this._findCommand(e[0]))
        )
          return this._dispatchSubcommand(e[0], e.slice(1), r);
        if (this._hasImplicitHelpCommand() && e[0] === this._helpCommandName) return this._dispatchHelpCommand(e[1]);
        if (this._defaultCommandName) return Fr(this, r), this._dispatchSubcommand(this._defaultCommandName, e, r);
        this.commands.length &&
          this.args.length === 0 &&
          !this._actionHandler &&
          !this._defaultCommandName &&
          this.help({ error: !0 }),
          Fr(this, n.unknown),
          this._checkForMissingMandatoryOptions(),
          this._checkForConflictingOptions();
        let s = () => {
            n.unknown.length > 0 && this.unknownOption(n.unknown[0]);
          },
          i = `command:${this.name()}`;
        if (this._actionHandler) {
          s(), this._processArguments();
          let o;
          return (
            (o = this._chainOrCallHooks(o, 'preAction')),
            (o = this._chainOrCall(o, () => this._actionHandler(this.processedArgs))),
            this.parent &&
              (o = this._chainOrCall(o, () => {
                this.parent.emit(i, e, r);
              })),
            (o = this._chainOrCallHooks(o, 'postAction')),
            o
          );
        }
        if (this.parent && this.parent.listenerCount(i)) s(), this._processArguments(), this.parent.emit(i, e, r);
        else if (e.length) {
          if (this._findCommand('*')) return this._dispatchSubcommand('*', e, r);
          this.listenerCount('command:*')
            ? this.emit('command:*', e, r)
            : this.commands.length
            ? this.unknownCommand()
            : (s(), this._processArguments());
        } else this.commands.length ? (s(), this.help({ error: !0 })) : (s(), this._processArguments());
      }
      _findCommand(e) {
        if (e) return this.commands.find((r) => r._name === e || r._aliases.includes(e));
      }
      _findOption(e) {
        return this.options.find((r) => r.is(e));
      }
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((e) => {
          e.options.forEach((r) => {
            r.mandatory && e.getOptionValue(r.attributeName()) === void 0 && e.missingMandatoryOptionValue(r);
          });
        });
      }
      _checkForConflictingLocalOptions() {
        let e = this.options.filter((n) => {
          let s = n.attributeName();
          return this.getOptionValue(s) === void 0 ? !1 : this.getOptionValueSource(s) !== 'default';
        });
        e.filter((n) => n.conflictsWith.length > 0).forEach((n) => {
          let s = e.find((i) => n.conflictsWith.includes(i.attributeName()));
          s && this._conflictingOption(n, s);
        });
      }
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((e) => {
          e._checkForConflictingLocalOptions();
        });
      }
      parseOptions(e) {
        let r = [],
          n = [],
          s = r,
          i = e.slice();
        function o(u) {
          return u.length > 1 && u[0] === '-';
        }
        let a = null;
        for (; i.length; ) {
          let u = i.shift();
          if (u === '--') {
            s === n && s.push(u), s.push(...i);
            break;
          }
          if (a && !o(u)) {
            this.emit(`option:${a.name()}`, u);
            continue;
          }
          if (((a = null), o(u))) {
            let c = this._findOption(u);
            if (c) {
              if (c.required) {
                let l = i.shift();
                l === void 0 && this.optionMissingArgument(c), this.emit(`option:${c.name()}`, l);
              } else if (c.optional) {
                let l = null;
                i.length > 0 && !o(i[0]) && (l = i.shift()), this.emit(`option:${c.name()}`, l);
              } else this.emit(`option:${c.name()}`);
              a = c.variadic ? c : null;
              continue;
            }
          }
          if (u.length > 2 && u[0] === '-' && u[1] !== '-') {
            let c = this._findOption(`-${u[1]}`);
            if (c) {
              c.required || (c.optional && this._combineFlagAndOptionalValue)
                ? this.emit(`option:${c.name()}`, u.slice(2))
                : (this.emit(`option:${c.name()}`), i.unshift(`-${u.slice(2)}`));
              continue;
            }
          }
          if (/^--[^=]+=/.test(u)) {
            let c = u.indexOf('='),
              l = this._findOption(u.slice(0, c));
            if (l && (l.required || l.optional)) {
              this.emit(`option:${l.name()}`, u.slice(c + 1));
              continue;
            }
          }
          if (
            (o(u) && (s = n),
            (this._enablePositionalOptions || this._passThroughOptions) && r.length === 0 && n.length === 0)
          ) {
            if (this._findCommand(u)) {
              r.push(u), i.length > 0 && n.push(...i);
              break;
            } else if (u === this._helpCommandName && this._hasImplicitHelpCommand()) {
              r.push(u), i.length > 0 && r.push(...i);
              break;
            } else if (this._defaultCommandName) {
              n.push(u), i.length > 0 && n.push(...i);
              break;
            }
          }
          if (this._passThroughOptions) {
            s.push(u), i.length > 0 && s.push(...i);
            break;
          }
          s.push(u);
        }
        return { operands: r, unknown: n };
      }
      opts() {
        if (this._storeOptionsAsProperties) {
          let e = {},
            r = this.options.length;
          for (let n = 0; n < r; n++) {
            let s = this.options[n].attributeName();
            e[s] = s === this._versionOptionName ? this._version : this[s];
          }
          return e;
        }
        return this._optionValues;
      }
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce((e, r) => Object.assign(e, r.opts()), {});
      }
      error(e, r) {
        this._outputConfiguration.outputError(
          `${e}
`,
          this._outputConfiguration.writeErr
        ),
          typeof this._showHelpAfterError == 'string'
            ? this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`)
            : this._showHelpAfterError &&
              (this._outputConfiguration.writeErr(`
`),
              this.outputHelp({ error: !0 }));
        let n = r || {},
          s = n.exitCode || 1,
          i = n.code || 'commander.error';
        this._exit(s, i, e);
      }
      _parseOptionsEnv() {
        this.options.forEach((e) => {
          if (e.envVar && e.envVar in w.env) {
            let r = e.attributeName();
            (this.getOptionValue(r) === void 0 ||
              ['default', 'config', 'env'].includes(this.getOptionValueSource(r))) &&
              (e.required || e.optional
                ? this.emit(`optionEnv:${e.name()}`, w.env[e.envVar])
                : this.emit(`optionEnv:${e.name()}`));
          }
        });
      }
      _parseOptionsImplied() {
        let e = new go(this.options),
          r = (n) =>
            this.getOptionValue(n) !== void 0 && !['default', 'implied'].includes(this.getOptionValueSource(n));
        this.options
          .filter(
            (n) =>
              n.implied !== void 0 &&
              r(n.attributeName()) &&
              e.valueFromOption(this.getOptionValue(n.attributeName()), n)
          )
          .forEach((n) => {
            Object.keys(n.implied)
              .filter((s) => !r(s))
              .forEach((s) => {
                this.setOptionValueWithSource(s, n.implied[s], 'implied');
              });
          });
      }
      missingArgument(e) {
        let r = `error: missing required argument '${e}'`;
        this.error(r, { code: 'commander.missingArgument' });
      }
      optionMissingArgument(e) {
        let r = `error: option '${e.flags}' argument missing`;
        this.error(r, { code: 'commander.optionMissingArgument' });
      }
      missingMandatoryOptionValue(e) {
        let r = `error: required option '${e.flags}' not specified`;
        this.error(r, { code: 'commander.missingMandatoryOptionValue' });
      }
      _conflictingOption(e, r) {
        let n = (o) => {
            let a = o.attributeName(),
              u = this.getOptionValue(a),
              c = this.options.find((h) => h.negate && a === h.attributeName()),
              l = this.options.find((h) => !h.negate && a === h.attributeName());
            return c && ((c.presetArg === void 0 && u === !1) || (c.presetArg !== void 0 && u === c.presetArg))
              ? c
              : l || o;
          },
          s = (o) => {
            let a = n(o),
              u = a.attributeName();
            return this.getOptionValueSource(u) === 'env'
              ? `environment variable '${a.envVar}'`
              : `option '${a.flags}'`;
          },
          i = `error: ${s(e)} cannot be used with ${s(r)}`;
        this.error(i, { code: 'commander.conflictingOption' });
      }
      unknownOption(e) {
        if (this._allowUnknownOption) return;
        let r = '';
        if (e.startsWith('--') && this._showSuggestionAfterError) {
          let s = [],
            i = this;
          do {
            let o = i
              .createHelp()
              .visibleOptions(i)
              .filter((a) => a.long)
              .map((a) => a.long);
            (s = s.concat(o)), (i = i.parent);
          } while (i && !i._enablePositionalOptions);
          r = xr(e, s);
        }
        let n = `error: unknown option '${e}'${r}`;
        this.error(n, { code: 'commander.unknownOption' });
      }
      _excessArguments(e) {
        if (this._allowExcessArguments) return;
        let r = this.registeredArguments.length,
          n = r === 1 ? '' : 's',
          i = `error: too many arguments${
            this.parent ? ` for '${this.name()}'` : ''
          }. Expected ${r} argument${n} but got ${e.length}.`;
        this.error(i, { code: 'commander.excessArguments' });
      }
      unknownCommand() {
        let e = this.args[0],
          r = '';
        if (this._showSuggestionAfterError) {
          let s = [];
          this.createHelp()
            .visibleCommands(this)
            .forEach((i) => {
              s.push(i.name()), i.alias() && s.push(i.alias());
            }),
            (r = xr(e, s));
        }
        let n = `error: unknown command '${e}'${r}`;
        this.error(n, { code: 'commander.unknownCommand' });
      }
      version(e, r, n) {
        if (e === void 0) return this._version;
        (this._version = e), (r = r || '-V, --version'), (n = n || 'output the version number');
        let s = this.createOption(r, n);
        return (
          (this._versionOptionName = s.attributeName()),
          this.options.push(s),
          this.on('option:' + s.name(), () => {
            this._outputConfiguration.writeOut(`${e}
`),
              this._exit(0, 'commander.version', e);
          }),
          this
        );
      }
      description(e, r) {
        return e === void 0 && r === void 0
          ? this._description
          : ((this._description = e), r && (this._argsDescription = r), this);
      }
      summary(e) {
        return e === void 0 ? this._summary : ((this._summary = e), this);
      }
      alias(e) {
        if (e === void 0) return this._aliases[0];
        let r = this;
        if (
          (this.commands.length !== 0 &&
            this.commands[this.commands.length - 1]._executableHandler &&
            (r = this.commands[this.commands.length - 1]),
          e === r._name)
        )
          throw new Error("Command alias can't be the same as its name");
        return r._aliases.push(e), this;
      }
      aliases(e) {
        return e === void 0 ? this._aliases : (e.forEach((r) => this.alias(r)), this);
      }
      usage(e) {
        if (e === void 0) {
          if (this._usage) return this._usage;
          let r = this.registeredArguments.map((n) => fo(n));
          return []
            .concat(
              this.options.length || this._hasHelpOption ? '[options]' : [],
              this.commands.length ? '[command]' : [],
              this.registeredArguments.length ? r : []
            )
            .join(' ');
        }
        return (this._usage = e), this;
      }
      name(e) {
        return e === void 0 ? this._name : ((this._name = e), this);
      }
      nameFromFilename(e) {
        return (this._name = Y.basename(e, Y.extname(e))), this;
      }
      executableDir(e) {
        return e === void 0 ? this._executableDir : ((this._executableDir = e), this);
      }
      helpInformation(e) {
        let r = this.createHelp();
        return (
          r.helpWidth === void 0 &&
            (r.helpWidth =
              e && e.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth()),
          r.formatHelp(this, r)
        );
      }
      _getHelpContext(e) {
        e = e || {};
        let r = { error: !!e.error },
          n;
        return (
          r.error
            ? (n = (s) => this._outputConfiguration.writeErr(s))
            : (n = (s) => this._outputConfiguration.writeOut(s)),
          (r.write = e.write || n),
          (r.command = this),
          r
        );
      }
      outputHelp(e) {
        let r;
        typeof e == 'function' && ((r = e), (e = void 0));
        let n = this._getHelpContext(e);
        this._getCommandAndAncestors()
          .reverse()
          .forEach((i) => i.emit('beforeAllHelp', n)),
          this.emit('beforeHelp', n);
        let s = this.helpInformation(n);
        if (r && ((s = r(s)), typeof s != 'string' && !Buffer.isBuffer(s)))
          throw new Error('outputHelp callback must return a string or a Buffer');
        n.write(s),
          this._helpLongFlag && this.emit(this._helpLongFlag),
          this.emit('afterHelp', n),
          this._getCommandAndAncestors().forEach((i) => i.emit('afterAllHelp', n));
      }
      helpOption(e, r) {
        if (typeof e == 'boolean') return (this._hasHelpOption = e), this;
        (this._helpFlags = e || this._helpFlags), (this._helpDescription = r || this._helpDescription);
        let n = mo(this._helpFlags);
        return (this._helpShortFlag = n.shortFlag), (this._helpLongFlag = n.longFlag), this;
      }
      help(e) {
        this.outputHelp(e);
        let r = w.exitCode || 0;
        r === 0 && e && typeof e != 'function' && e.error && (r = 1), this._exit(r, 'commander.help', '(outputHelp)');
      }
      addHelpText(e, r) {
        let n = ['beforeAll', 'before', 'after', 'afterAll'];
        if (!n.includes(e))
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${n.join("', '")}'`);
        let s = `${e}Help`;
        return (
          this.on(s, (i) => {
            let o;
            typeof r == 'function' ? (o = r({ error: i.error, command: i.command })) : (o = r),
              o &&
                i.write(`${o}
`);
          }),
          this
        );
      }
    };
  function Fr(t, e) {
    t._hasHelpOption &&
      e.find((n) => n === t._helpLongFlag || n === t._helpShortFlag) &&
      (t.outputHelp(), t._exit(0, 'commander.helpDisplayed', '(outputHelp)'));
  }
  function Rr(t) {
    return t.map((e) => {
      if (!e.startsWith('--inspect')) return e;
      let r,
        n = '127.0.0.1',
        s = '9229',
        i;
      return (
        (i = e.match(/^(--inspect(-brk)?)$/)) !== null
          ? (r = i[1])
          : (i = e.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null
          ? ((r = i[1]), /^\d+$/.test(i[3]) ? (s = i[3]) : (n = i[3]))
          : (i = e.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null && ((r = i[1]), (n = i[3]), (s = i[4])),
        r && s !== '0' ? `${r}=${n}:${parseInt(s) + 1}` : e
      );
    });
  }
  Pr.Command = Tt;
});
var Lr = P((W, Ir) => {
  var { Argument: _o } = De(),
    { Command: Mr } = $r(),
    { CommanderError: bo, InvalidArgumentError: Dr } = ve(),
    { Help: yo } = bt(),
    { Option: vo } = kt();
  W = Ir.exports = new Mr();
  W.program = W;
  W.Command = Mr;
  W.Option = vo;
  W.Argument = _o;
  W.Help = yo;
  W.CommanderError = bo;
  W.InvalidArgumentError = Dr;
  W.InvalidOptionArgumentError = Dr;
});
var Vr = P((bl, Hr) => {
  var he = 1e3,
    fe = he * 60,
    pe = fe * 60,
    se = pe * 24,
    ko = se * 7,
    Co = se * 365.25;
  Hr.exports = function (t, e) {
    e = e || {};
    var r = typeof t;
    if (r === 'string' && t.length > 0) return wo(t);
    if (r === 'number' && isFinite(t)) return e.long ? To(t) : Oo(t);
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(t));
  };
  function wo(t) {
    if (((t = String(t)), !(t.length > 100))) {
      var e =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          t
        );
      if (e) {
        var r = parseFloat(e[1]),
          n = (e[2] || 'ms').toLowerCase();
        switch (n) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return r * Co;
          case 'weeks':
          case 'week':
          case 'w':
            return r * ko;
          case 'days':
          case 'day':
          case 'd':
            return r * se;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return r * pe;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return r * fe;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return r * he;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return r;
          default:
            return;
        }
      }
    }
  }
  function Oo(t) {
    var e = Math.abs(t);
    return e >= se
      ? Math.round(t / se) + 'd'
      : e >= pe
      ? Math.round(t / pe) + 'h'
      : e >= fe
      ? Math.round(t / fe) + 'm'
      : e >= he
      ? Math.round(t / he) + 's'
      : t + 'ms';
  }
  function To(t) {
    var e = Math.abs(t);
    return e >= se
      ? Le(t, e, se, 'day')
      : e >= pe
      ? Le(t, e, pe, 'hour')
      : e >= fe
      ? Le(t, e, fe, 'minute')
      : e >= he
      ? Le(t, e, he, 'second')
      : t + ' ms';
  }
  function Le(t, e, r, n) {
    var s = e >= r * 1.5;
    return Math.round(t / r) + ' ' + n + (s ? 's' : '');
  }
});
var At = P((yl, Br) => {
  function Ao(t) {
    (r.debug = r),
      (r.default = r),
      (r.coerce = u),
      (r.disable = i),
      (r.enable = s),
      (r.enabled = o),
      (r.humanize = Vr()),
      (r.destroy = c),
      Object.keys(t).forEach((l) => {
        r[l] = t[l];
      }),
      (r.names = []),
      (r.skips = []),
      (r.formatters = {});
    function e(l) {
      let h = 0;
      for (let m = 0; m < l.length; m++) (h = (h << 5) - h + l.charCodeAt(m)), (h |= 0);
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = e;
    function r(l) {
      let h,
        m = null,
        d,
        v;
      function S(...F) {
        if (!S.enabled) return;
        let Q = S,
          ce = Number(new Date()),
          ct = ce - (h || ce);
        (Q.diff = ct),
          (Q.prev = h),
          (Q.curr = ce),
          (h = ce),
          (F[0] = r.coerce(F[0])),
          typeof F[0] != 'string' && F.unshift('%O');
        let le = 0;
        (F[0] = F[0].replace(/%([a-zA-Z%])/g, (ye, lt) => {
          if (ye === '%%') return '%';
          le++;
          let $e = r.formatters[lt];
          if (typeof $e == 'function') {
            let ht = F[le];
            (ye = $e.call(Q, ht)), F.splice(le, 1), le--;
          }
          return ye;
        })),
          r.formatArgs.call(Q, F),
          (Q.log || r.log).apply(Q, F);
      }
      return (
        (S.namespace = l),
        (S.useColors = r.useColors()),
        (S.color = r.selectColor(l)),
        (S.extend = n),
        (S.destroy = r.destroy),
        Object.defineProperty(S, 'enabled', {
          enumerable: !0,
          configurable: !1,
          get: () => (m !== null ? m : (d !== r.namespaces && ((d = r.namespaces), (v = r.enabled(l))), v)),
          set: (F) => {
            m = F;
          },
        }),
        typeof r.init == 'function' && r.init(S),
        S
      );
    }
    function n(l, h) {
      let m = r(this.namespace + (typeof h > 'u' ? ':' : h) + l);
      return (m.log = this.log), m;
    }
    function s(l) {
      r.save(l), (r.namespaces = l), (r.names = []), (r.skips = []);
      let h,
        m = (typeof l == 'string' ? l : '').split(/[\s,]+/),
        d = m.length;
      for (h = 0; h < d; h++)
        m[h] &&
          ((l = m[h].replace(/\*/g, '.*?')),
          l[0] === '-' ? r.skips.push(new RegExp('^' + l.slice(1) + '$')) : r.names.push(new RegExp('^' + l + '$')));
    }
    function i() {
      let l = [...r.names.map(a), ...r.skips.map(a).map((h) => '-' + h)].join(',');
      return r.enable(''), l;
    }
    function o(l) {
      if (l[l.length - 1] === '*') return !0;
      let h, m;
      for (h = 0, m = r.skips.length; h < m; h++) if (r.skips[h].test(l)) return !1;
      for (h = 0, m = r.names.length; h < m; h++) if (r.names[h].test(l)) return !0;
      return !1;
    }
    function a(l) {
      return l
        .toString()
        .substring(2, l.toString().length - 2)
        .replace(/\.\*\?$/, '*');
    }
    function u(l) {
      return l instanceof Error ? l.stack || l.message : l;
    }
    function c() {
      console.warn(
        'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
      );
    }
    return r.enable(r.load()), r;
  }
  Br.exports = Ao;
});
var qr = P((j, Ne) => {
  j.formatArgs = Eo;
  j.save = xo;
  j.load = Fo;
  j.useColors = So;
  j.storage = Ro();
  j.destroy = (() => {
    let t = !1;
    return () => {
      t ||
        ((t = !0),
        console.warn(
          'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
        ));
    };
  })();
  j.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33',
  ];
  function So() {
    return typeof window < 'u' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)
      ? !0
      : typeof navigator < 'u' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ? !1
      : (typeof document < 'u' &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) ||
        (typeof window < 'u' &&
          window.console &&
          (window.console.firebug || (window.console.exception && window.console.table))) ||
        (typeof navigator < 'u' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31) ||
        (typeof navigator < 'u' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }
  function Eo(t) {
    if (
      ((t[0] =
        (this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        t[0] +
        (this.useColors ? '%c ' : ' ') +
        '+' +
        Ne.exports.humanize(this.diff)),
      !this.useColors)
    )
      return;
    let e = 'color: ' + this.color;
    t.splice(1, 0, e, 'color: inherit');
    let r = 0,
      n = 0;
    t[0].replace(/%[a-zA-Z%]/g, (s) => {
      s !== '%%' && (r++, s === '%c' && (n = r));
    }),
      t.splice(n, 0, e);
  }
  j.log = console.debug || console.log || (() => {});
  function xo(t) {
    try {
      t ? j.storage.setItem('debug', t) : j.storage.removeItem('debug');
    } catch {}
  }
  function Fo() {
    let t;
    try {
      t = j.storage.getItem('debug');
    } catch {}
    return !t && typeof process < 'u' && 'env' in process && (t = process.env.DEBUG), t;
  }
  function Ro() {
    try {
      return localStorage;
    } catch {}
  }
  Ne.exports = At()(j);
  var { formatters: Po } = Ne.exports;
  Po.j = function (t) {
    try {
      return JSON.stringify(t);
    } catch (e) {
      return '[UnexpectedJSONParseError]: ' + e.message;
    }
  };
});
var Ur = P((vl, Gr) => {
  'use strict';
  Gr.exports = (t, e = process.argv) => {
    let r = t.startsWith('-') ? '' : t.length === 1 ? '-' : '--',
      n = e.indexOf(r + t),
      s = e.indexOf('--');
    return n !== -1 && (s === -1 || n < s);
  };
});
var Kr = P((kl, zr) => {
  'use strict';
  var $o = require('os'),
    Wr = require('tty'),
    q = Ur(),
    { env: R } = process,
    X;
  q('no-color') || q('no-colors') || q('color=false') || q('color=never')
    ? (X = 0)
    : (q('color') || q('colors') || q('color=true') || q('color=always')) && (X = 1);
  'FORCE_COLOR' in R &&
    (R.FORCE_COLOR === 'true'
      ? (X = 1)
      : R.FORCE_COLOR === 'false'
      ? (X = 0)
      : (X = R.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(R.FORCE_COLOR, 10), 3)));
  function St(t) {
    return t === 0 ? !1 : { level: t, hasBasic: !0, has256: t >= 2, has16m: t >= 3 };
  }
  function Et(t, e) {
    if (X === 0) return 0;
    if (q('color=16m') || q('color=full') || q('color=truecolor')) return 3;
    if (q('color=256')) return 2;
    if (t && !e && X === void 0) return 0;
    let r = X || 0;
    if (R.TERM === 'dumb') return r;
    if (process.platform === 'win32') {
      let n = $o.release().split('.');
      return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? (Number(n[2]) >= 14931 ? 3 : 2) : 1;
    }
    if ('CI' in R)
      return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some((n) => n in R) ||
        R.CI_NAME === 'codeship'
        ? 1
        : r;
    if ('TEAMCITY_VERSION' in R) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(R.TEAMCITY_VERSION) ? 1 : 0;
    if (R.COLORTERM === 'truecolor') return 3;
    if ('TERM_PROGRAM' in R) {
      let n = parseInt((R.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
      switch (R.TERM_PROGRAM) {
        case 'iTerm.app':
          return n >= 3 ? 3 : 2;
        case 'Apple_Terminal':
          return 2;
      }
    }
    return /-256(color)?$/i.test(R.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(R.TERM) || 'COLORTERM' in R
      ? 1
      : r;
  }
  function Mo(t) {
    let e = Et(t, t && t.isTTY);
    return St(e);
  }
  zr.exports = { supportsColor: Mo, stdout: St(Et(!0, Wr.isatty(1))), stderr: St(Et(!0, Wr.isatty(2))) };
});
var Yr = P(($, He) => {
  var Do = require('tty'),
    je = require('util');
  $.init = Bo;
  $.log = jo;
  $.formatArgs = Lo;
  $.save = Ho;
  $.load = Vo;
  $.useColors = Io;
  $.destroy = je.deprecate(() => {},
  'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  $.colors = [6, 2, 3, 4, 5, 1];
  try {
    let t = Kr();
    t &&
      (t.stderr || t).level >= 2 &&
      ($.colors = [
        20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81,
        92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
        171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214,
        215, 220, 221,
      ]);
  } catch {}
  $.inspectOpts = Object.keys(process.env)
    .filter((t) => /^debug_/i.test(t))
    .reduce((t, e) => {
      let r = e
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (s, i) => i.toUpperCase()),
        n = process.env[e];
      return (
        /^(yes|on|true|enabled)$/i.test(n)
          ? (n = !0)
          : /^(no|off|false|disabled)$/i.test(n)
          ? (n = !1)
          : n === 'null'
          ? (n = null)
          : (n = Number(n)),
        (t[r] = n),
        t
      );
    }, {});
  function Io() {
    return 'colors' in $.inspectOpts ? !!$.inspectOpts.colors : Do.isatty(process.stderr.fd);
  }
  function Lo(t) {
    let { namespace: e, useColors: r } = this;
    if (r) {
      let n = this.color,
        s = '\x1B[3' + (n < 8 ? n : '8;5;' + n),
        i = `  ${s};1m${e} \x1B[0m`;
      (t[0] =
        i +
        t[0]
          .split(
            `
`
          )
          .join(
            `
` + i
          )),
        t.push(s + 'm+' + He.exports.humanize(this.diff) + '\x1B[0m');
    } else t[0] = No() + e + ' ' + t[0];
  }
  function No() {
    return $.inspectOpts.hideDate ? '' : new Date().toISOString() + ' ';
  }
  function jo(...t) {
    return process.stderr.write(
      je.format(...t) +
        `
`
    );
  }
  function Ho(t) {
    t ? (process.env.DEBUG = t) : delete process.env.DEBUG;
  }
  function Vo() {
    return process.env.DEBUG;
  }
  function Bo(t) {
    t.inspectOpts = {};
    let e = Object.keys($.inspectOpts);
    for (let r = 0; r < e.length; r++) t.inspectOpts[e[r]] = $.inspectOpts[e[r]];
  }
  He.exports = At()($);
  var { formatters: Qr } = He.exports;
  Qr.o = function (t) {
    return (
      (this.inspectOpts.colors = this.useColors),
      je
        .inspect(t, this.inspectOpts)
        .split(
          `
`
        )
        .map((e) => e.trim())
        .join(' ')
    );
  };
  Qr.O = function (t) {
    return (this.inspectOpts.colors = this.useColors), je.inspect(t, this.inspectOpts);
  };
});
var Ft = P((Cl, xt) => {
  typeof process > 'u' || process.type === 'renderer' || process.browser === !0 || process.__nwjs
    ? (xt.exports = qr())
    : (xt.exports = Yr());
});
var Jr = P((H) => {
  'use strict';
  var qo =
    (H && H.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(H, '__esModule', { value: !0 });
  var Go = require('fs'),
    Uo = qo(Ft()),
    me = Uo.default('@kwsites/file-exists');
  function Wo(t, e, r) {
    me('checking %s', t);
    try {
      let n = Go.statSync(t);
      return n.isFile() && e
        ? (me('[OK] path represents a file'), !0)
        : n.isDirectory() && r
        ? (me('[OK] path represents a directory'), !0)
        : (me('[FAIL] path represents something other than a file or directory'), !1);
    } catch (n) {
      if (n.code === 'ENOENT') return me('[FAIL] path is not accessible: %o', n), !1;
      throw (me('[FATAL] %o', n), n);
    }
  }
  function zo(t, e = H.READABLE) {
    return Wo(t, (e & H.FILE) > 0, (e & H.FOLDER) > 0);
  }
  H.exists = zo;
  H.FILE = 1;
  H.FOLDER = 2;
  H.READABLE = H.FILE + H.FOLDER;
});
var Xr = P((Ve) => {
  'use strict';
  function Ko(t) {
    for (var e in t) Ve.hasOwnProperty(e) || (Ve[e] = t[e]);
  }
  Object.defineProperty(Ve, '__esModule', { value: !0 });
  Ko(Jr());
});
var Pt = P((ie) => {
  'use strict';
  Object.defineProperty(ie, '__esModule', { value: !0 });
  ie.createDeferred = ie.deferred = void 0;
  function Rt() {
    let t,
      e,
      r = 'pending';
    return {
      promise: new Promise((s, i) => {
        (t = s), (e = i);
      }),
      done(s) {
        r === 'pending' && ((r = 'resolved'), t(s));
      },
      fail(s) {
        r === 'pending' && ((r = 'rejected'), e(s));
      },
      get fulfilled() {
        return r !== 'pending';
      },
      get status() {
        return r;
      },
    };
  }
  ie.deferred = Rt;
  ie.createDeferred = Rt;
  ie.default = Rt;
});
var Nr = ne(Lr(), 1),
  {
    program: al,
    createCommand: ul,
    createArgument: cl,
    createOption: ll,
    CommanderError: hl,
    InvalidArgumentError: fl,
    InvalidOptionArgumentError: pl,
    Command: jr,
    Argument: ml,
    Option: dl,
    Help: gl,
  } = Nr.default;
var et = ne(Xr(), 1),
  Ye = ne(Ft(), 1),
  vs = require('child_process'),
  ri = ne(Pt(), 1),
  ge = ne(Pt(), 1),
  Xe = Object.defineProperty,
  Qo = Object.defineProperties,
  Yo = Object.getOwnPropertyDescriptor,
  Jo = Object.getOwnPropertyDescriptors,
  Yt = Object.getOwnPropertyNames,
  Zr = Object.getOwnPropertySymbols,
  Rn = Object.prototype.hasOwnProperty,
  Xo = Object.prototype.propertyIsEnumerable,
  en = (t, e, r) => (e in t ? Xe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (t[e] = r)),
  G = (t, e) => {
    for (var r in e || (e = {})) Rn.call(e, r) && en(t, r, e[r]);
    if (Zr) for (var r of Zr(e)) Xo.call(e, r) && en(t, r, e[r]);
    return t;
  },
  we = (t, e) => Qo(t, Jo(e)),
  Zo = (t) => Xe(t, '__esModule', { value: !0 }),
  p = (t, e) =>
    function () {
      return t && (e = (0, t[Yt(t)[0]])((t = 0))), e;
    },
  ea = (t, e) =>
    function () {
      return e || (0, t[Yt(t)[0]])((e = { exports: {} }).exports, e), e.exports;
    },
  x = (t, e) => {
    for (var r in e) Xe(t, r, { get: e[r], enumerable: !0 });
  },
  ta = (t, e, r, n) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let s of Yt(e))
        !Rn.call(t, s) &&
          (r || s !== 'default') &&
          Xe(t, s, { get: () => e[s], enumerable: !(n = Yo(e, s)) || n.enumerable });
    return t;
  },
  T = (
    (t) => (e, r) =>
      (t && t.get(e)) || ((r = ta(Zo({}), e, 1)), t && t.set(e, r), r)
  )(typeof WeakMap < 'u' ? new WeakMap() : 0),
  Ce = (t, e, r) =>
    new Promise((n, s) => {
      var i = (u) => {
          try {
            a(r.next(u));
          } catch (c) {
            s(c);
          }
        },
        o = (u) => {
          try {
            a(r.throw(u));
          } catch (c) {
            s(c);
          }
        },
        a = (u) => (u.done ? n(u.value) : Promise.resolve(u.value).then(i, o));
      a((r = r.apply(t, e)).next());
    });
function ra(...t) {
  let e = new String(t);
  return Ze.set(e, t), e;
}
function Ke(t) {
  return t instanceof String && Ze.has(t);
}
function tn(t) {
  return Ze.get(t) || [];
}
var Ze,
  Se = p({
    'src/lib/args/pathspec.ts'() {
      Ze = new WeakMap();
    },
  }),
  J,
  te = p({
    'src/lib/errors/git-error.ts'() {
      J = class extends Error {
        constructor(t, e) {
          super(e), (this.task = t), Object.setPrototypeOf(this, new.target.prototype);
        }
      };
    },
  }),
  Ee,
  be = p({
    'src/lib/errors/git-response-error.ts'() {
      te(),
        (Ee = class extends J {
          constructor(t, e) {
            super(void 0, e || String(t)), (this.git = t);
          }
        });
    },
  }),
  Pn,
  $n = p({
    'src/lib/errors/task-configuration-error.ts'() {
      te(),
        (Pn = class extends J {
          constructor(t) {
            super(void 0, t);
          }
        });
    },
  });
function Mn(t) {
  return typeof t == 'function' ? t : ue;
}
function Dn(t) {
  return typeof t == 'function' && t !== ue;
}
function In(t, e) {
  let r = t.indexOf(e);
  return r <= 0 ? [t, ''] : [t.substr(0, r), t.substr(r + 1)];
}
function Ln(t, e = 0) {
  return Nn(t) && t.length > e ? t[e] : void 0;
}
function ae(t, e = 0) {
  if (Nn(t) && t.length > e) return t[t.length - 1 - e];
}
function Nn(t) {
  return !!(t && typeof t.length == 'number');
}
function xe(
  t = '',
  e = !0,
  r = `
`
) {
  return t.split(r).reduce((n, s) => {
    let i = e ? s.trim() : s;
    return i && n.push(i), n;
  }, []);
}
function Jt(t, e) {
  return xe(t, !0).map((r) => e(r));
}
function Xt(t) {
  return (0, et.exists)(t, et.FOLDER);
}
function k(t, e) {
  return Array.isArray(t) ? t.includes(e) || t.push(e) : t.add(e), e;
}
function jn(t, e) {
  return Array.isArray(t) && !t.includes(e) && t.push(e), t;
}
function tt(t, e) {
  if (Array.isArray(t)) {
    let r = t.indexOf(e);
    r >= 0 && t.splice(r, 1);
  } else t.delete(e);
  return e;
}
function ee(t) {
  return Array.isArray(t) ? t : [t];
}
function Hn(t) {
  return ee(t).map(String);
}
function O(t, e = 0) {
  if (t == null) return e;
  let r = parseInt(t, 10);
  return isNaN(r) ? e : r;
}
function Oe(t, e) {
  let r = [];
  for (let n = 0, s = t.length; n < s; n++) r.push(e, t[n]);
  return r;
}
function Te(t) {
  return (Array.isArray(t) ? Buffer.concat(t) : t).toString('utf-8');
}
function Vn(t, e) {
  return Object.assign({}, ...e.map((r) => (r in t ? { [r]: t[r] } : {})));
}
function Nt(t = 0) {
  return new Promise((e) => setTimeout(e, t));
}
var _e,
  ue,
  Fe,
  rt = p({
    'src/lib/utils/util.ts'() {
      (_e = '\0'), (ue = () => {}), (Fe = Object.prototype.toString.call.bind(Object.prototype.toString));
    },
  });
function K(t, e, r) {
  return e(t) ? t : arguments.length > 2 ? r : void 0;
}
function Zt(t, e) {
  let r = Ke(t) ? 'string' : typeof t;
  return /number|string|boolean/.test(r) && (!e || !e.includes(r));
}
function er(t) {
  return !!t && Fe(t) === '[object Object]';
}
function Bn(t) {
  return typeof t == 'function';
}
var Re,
  M,
  qn,
  Qe,
  tr,
  Gn = p({
    'src/lib/utils/argument-filters.ts'() {
      rt(),
        Se(),
        (Re = (t) => Array.isArray(t)),
        (M = (t) => typeof t == 'string'),
        (qn = (t) => Array.isArray(t) && t.every(M)),
        (Qe = (t) => M(t) || (Array.isArray(t) && t.every(M))),
        (tr = (t) =>
          t == null || 'number|boolean|function'.includes(typeof t)
            ? !1
            : Array.isArray(t) || typeof t == 'string' || typeof t.length == 'number');
    },
  }),
  jt,
  na = p({
    'src/lib/utils/exit-codes.ts'() {
      jt = ((t) => (
        (t[(t.SUCCESS = 0)] = 'SUCCESS'),
        (t[(t.ERROR = 1)] = 'ERROR'),
        (t[(t.NOT_FOUND = -2)] = 'NOT_FOUND'),
        (t[(t.UNCLEAN = 128)] = 'UNCLEAN'),
        t
      ))(jt || {});
    },
  }),
  Ae,
  sa = p({
    'src/lib/utils/git-output-streams.ts'() {
      Ae = class {
        constructor(t, e) {
          (this.stdOut = t), (this.stdErr = e);
        }
        asStrings() {
          return new Ae(this.stdOut.toString('utf8'), this.stdErr.toString('utf8'));
        }
      };
    },
  }),
  y,
  Z,
  ia = p({
    'src/lib/utils/line-parser.ts'() {
      (y = class {
        constructor(t, e) {
          (this.matches = []),
            (this.parse = (r, n) => (
              this.resetMatches(),
              this._regExp.every((s, i) => this.addMatch(s, i, r(i)))
                ? this.useMatches(n, this.prepareMatches()) !== !1
                : !1
            )),
            (this._regExp = Array.isArray(t) ? t : [t]),
            e && (this.useMatches = e);
        }
        useMatches(t, e) {
          throw new Error('LineParser:useMatches not implemented');
        }
        resetMatches() {
          this.matches.length = 0;
        }
        prepareMatches() {
          return this.matches;
        }
        addMatch(t, e, r) {
          let n = r && t.exec(r);
          return n && this.pushMatch(e, n), !!n;
        }
        pushMatch(t, e) {
          this.matches.push(...e.slice(1));
        }
      }),
        (Z = class extends y {
          addMatch(t, e, r) {
            return /^remote:\s/.test(String(r)) && super.addMatch(t, e, r);
          }
          pushMatch(t, e) {
            (t > 0 || e.length > 1) && super.pushMatch(t, e);
          }
        });
    },
  });
function Un(...t) {
  let e = process.cwd(),
    r = Object.assign(G({ baseDir: e }, Wn), ...t.filter((n) => typeof n == 'object' && n));
  return (r.baseDir = r.baseDir || e), (r.trimmed = r.trimmed === !0), r;
}
var Wn,
  oa = p({
    'src/lib/utils/simple-git-options.ts'() {
      Wn = { binary: 'git', maxConcurrentProcesses: 5, config: [], trimmed: !1 };
    },
  });
function rr(t, e = []) {
  return er(t)
    ? Object.keys(t).reduce((r, n) => {
        let s = t[n];
        return Ke(s) ? r.push(s) : Zt(s, ['boolean']) ? r.push(n + '=' + s) : r.push(n), r;
      }, e)
    : e;
}
function L(t, e = 0, r = !1) {
  let n = [];
  for (let s = 0, i = e < 0 ? t.length : e; s < i; s++) 'string|number'.includes(typeof t[s]) && n.push(String(t[s]));
  return rr(nr(t), n), r || n.push(...aa(t)), n;
}
function aa(t) {
  let e = typeof ae(t) == 'function';
  return K(ae(t, e ? 1 : 0), Re, []);
}
function nr(t) {
  let e = Bn(ae(t));
  return K(ae(t, e ? 1 : 0), er);
}
function A(t, e = !0) {
  let r = Mn(ae(t));
  return e || Dn(r) ? r : void 0;
}
var ua = p({
  'src/lib/utils/task-options.ts'() {
    Gn(), rt(), Se();
  },
});
function Ht(t, e) {
  return t(e.stdOut, e.stdErr);
}
function B(t, e, r, n = !0) {
  return (
    ee(r).forEach((s) => {
      for (let i = xe(s, n), o = 0, a = i.length; o < a; o++) {
        let u = (c = 0) => {
          if (!(o + c >= a)) return i[o + c];
        };
        e.some(({ parse: c }) => c(u, t));
      }
    }),
    t
  );
}
var ca = p({
    'src/lib/utils/task-parser.ts'() {
      rt();
    },
  }),
  zn = {};
x(zn, {
  ExitCodes: () => jt,
  GitOutputStreams: () => Ae,
  LineParser: () => y,
  NOOP: () => ue,
  NULL: () => _e,
  RemoteLineParser: () => Z,
  append: () => k,
  appendTaskOptions: () => rr,
  asArray: () => ee,
  asFunction: () => Mn,
  asNumber: () => O,
  asStringArray: () => Hn,
  bufferToString: () => Te,
  callTaskParser: () => Ht,
  createInstanceConfig: () => Un,
  delay: () => Nt,
  filterArray: () => Re,
  filterFunction: () => Bn,
  filterHasLength: () => tr,
  filterPlainObject: () => er,
  filterPrimitives: () => Zt,
  filterString: () => M,
  filterStringArray: () => qn,
  filterStringOrStringArray: () => Qe,
  filterType: () => K,
  first: () => Ln,
  folderExists: () => Xt,
  forEachLineWithContent: () => Jt,
  getTrailingOptions: () => L,
  including: () => jn,
  isUserFunction: () => Dn,
  last: () => ae,
  objectToString: () => Fe,
  parseStringResponse: () => B,
  pick: () => Vn,
  prefixedArray: () => Oe,
  remove: () => tt,
  splitOn: () => In,
  toLinesWithContent: () => xe,
  trailingFunctionArgument: () => A,
  trailingOptionsArgument: () => nr,
});
var b = p({
    'src/lib/utils/index.ts'() {
      Gn(), na(), sa(), ia(), oa(), ua(), ca(), rt();
    },
  }),
  Kn = {};
x(Kn, {
  CheckRepoActions: () => Vt,
  checkIsBareRepoTask: () => Yn,
  checkIsRepoRootTask: () => Qn,
  checkIsRepoTask: () => la,
});
function la(t) {
  switch (t) {
    case 'bare':
      return Yn();
    case 'root':
      return Qn();
  }
  return { commands: ['rev-parse', '--is-inside-work-tree'], format: 'utf-8', onError: nt, parser: sr };
}
function Qn() {
  return {
    commands: ['rev-parse', '--git-dir'],
    format: 'utf-8',
    onError: nt,
    parser(e) {
      return /^\.(git)?$/.test(e.trim());
    },
  };
}
function Yn() {
  return { commands: ['rev-parse', '--is-bare-repository'], format: 'utf-8', onError: nt, parser: sr };
}
function ha(t) {
  return /(Not a git repository|Kein Git-Repository)/i.test(String(t));
}
var Vt,
  nt,
  sr,
  Jn = p({
    'src/lib/tasks/check-is-repo.ts'() {
      b(),
        (Vt = ((t) => ((t.BARE = 'bare'), (t.IN_TREE = 'tree'), (t.IS_REPO_ROOT = 'root'), t))(Vt || {})),
        (nt = ({ exitCode: t }, e, r, n) => {
          if (t === 128 && ha(e)) return r(Buffer.from('false'));
          n(e);
        }),
        (sr = (t) => t.trim() === 'true');
    },
  });
function fa(t, e) {
  let r = new Xn(t),
    n = t ? es : Zn;
  return (
    xe(e).forEach((s) => {
      let i = s.replace(n, '');
      r.paths.push(i), (ts.test(i) ? r.folders : r.files).push(i);
    }),
    r
  );
}
var Xn,
  Zn,
  es,
  ts,
  pa = p({
    'src/lib/responses/CleanSummary.ts'() {
      b(),
        (Xn = class {
          constructor(t) {
            (this.dryRun = t), (this.paths = []), (this.files = []), (this.folders = []);
          }
        }),
        (Zn = /^[a-z]+\s*/i),
        (es = /^[a-z]+\s+[a-z]+\s*/i),
        (ts = /\/$/);
    },
  }),
  Bt = {};
x(Bt, {
  EMPTY_COMMANDS: () => st,
  adhocExecTask: () => rs,
  configurationErrorTask: () => N,
  isBufferTask: () => ss,
  isEmptyTask: () => is,
  straightThroughBufferTask: () => ns,
  straightThroughStringTask: () => I,
});
function rs(t) {
  return { commands: st, format: 'empty', parser: t };
}
function N(t) {
  return {
    commands: st,
    format: 'empty',
    parser() {
      throw typeof t == 'string' ? new Pn(t) : t;
    },
  };
}
function I(t, e = !1) {
  return {
    commands: t,
    format: 'utf-8',
    parser(r) {
      return e ? String(r).trim() : r;
    },
  };
}
function ns(t) {
  return {
    commands: t,
    format: 'buffer',
    parser(e) {
      return e;
    },
  };
}
function ss(t) {
  return t.format === 'buffer';
}
function is(t) {
  return t.format === 'empty' || !t.commands.length;
}
var st,
  E = p({
    'src/lib/tasks/task.ts'() {
      $n(), (st = []);
    },
  }),
  os = {};
x(os, {
  CONFIG_ERROR_INTERACTIVE_MODE: () => ir,
  CONFIG_ERROR_MODE_REQUIRED: () => or,
  CONFIG_ERROR_UNKNOWN_OPTION: () => ar,
  CleanOptions: () => Ge,
  cleanTask: () => as,
  cleanWithOptionsTask: () => ma,
  isCleanOptionsArray: () => da,
});
function ma(t, e) {
  let { cleanMode: r, options: n, valid: s } = ga(t);
  return r ? (s.options ? (n.push(...e), n.some(ya) ? N(ir) : as(r, n)) : N(ar + JSON.stringify(t))) : N(or);
}
function as(t, e) {
  return {
    commands: ['clean', `-${t}`, ...e],
    format: 'utf-8',
    parser(n) {
      return fa(t === 'n', n);
    },
  };
}
function da(t) {
  return Array.isArray(t) && t.every((e) => ur.has(e));
}
function ga(t) {
  let e,
    r = [],
    n = { cleanMode: !1, options: !0 };
  return (
    t
      .replace(/[^a-z]i/g, '')
      .split('')
      .forEach((s) => {
        _a(s) ? ((e = s), (n.cleanMode = !0)) : (n.options = n.options && ba((r[r.length] = `-${s}`)));
      }),
    { cleanMode: e, options: r, valid: n }
  );
}
function _a(t) {
  return t === 'f' || t === 'n';
}
function ba(t) {
  return /^-[a-z]$/i.test(t) && ur.has(t.charAt(1));
}
function ya(t) {
  return /^-[^\-]/.test(t) ? t.indexOf('i') > 0 : t === '--interactive';
}
var ir,
  or,
  ar,
  Ge,
  ur,
  us = p({
    'src/lib/tasks/clean.ts'() {
      pa(),
        b(),
        E(),
        (ir = 'Git clean interactive mode is not supported'),
        (or = 'Git clean mode parameter ("n" or "f") is required'),
        (ar = 'Git clean unknown option found in: '),
        (Ge = ((t) => (
          (t.DRY_RUN = 'n'),
          (t.FORCE = 'f'),
          (t.IGNORED_INCLUDED = 'x'),
          (t.IGNORED_ONLY = 'X'),
          (t.EXCLUDING = 'e'),
          (t.QUIET = 'q'),
          (t.RECURSIVE = 'd'),
          t
        ))(Ge || {})),
        (ur = new Set(['i', ...Hn(Object.values(Ge))]));
    },
  });
function va(t) {
  let e = new ls();
  for (let r of cs(t)) e.addValue(r.file, String(r.key), r.value);
  return e;
}
function ka(t, e) {
  let r = null,
    n = [],
    s = new Map();
  for (let i of cs(t, e))
    i.key === e && (n.push((r = i.value)), s.has(i.file) || s.set(i.file, []), s.get(i.file).push(r));
  return { key: e, paths: Array.from(s.keys()), scopes: s, value: r, values: n };
}
function Ca(t) {
  return t.replace(/^(file):/, '');
}
function* cs(t, e = null) {
  let r = t.split('\0');
  for (let n = 0, s = r.length - 1; n < s; ) {
    let i = Ca(r[n++]),
      o = r[n++],
      a = e;
    if (
      o.includes(`
`)
    ) {
      let u = In(
        o,
        `
`
      );
      (a = u[0]), (o = u[1]);
    }
    yield { file: i, key: a, value: o };
  }
}
var ls,
  wa = p({
    'src/lib/responses/ConfigList.ts'() {
      b(),
        (ls = class {
          constructor() {
            (this.files = []), (this.values = Object.create(null));
          }
          get all() {
            return (
              this._all || (this._all = this.files.reduce((t, e) => Object.assign(t, this.values[e]), {})), this._all
            );
          }
          addFile(t) {
            if (!(t in this.values)) {
              let e = ae(this.files);
              (this.values[t] = e ? Object.create(this.values[e]) : {}), this.files.push(t);
            }
            return this.values[t];
          }
          addValue(t, e, r) {
            let n = this.addFile(t);
            n.hasOwnProperty(e) ? (Array.isArray(n[e]) ? n[e].push(r) : (n[e] = [n[e], r])) : (n[e] = r),
              (this._all = void 0);
          }
        });
    },
  });
function $t(t, e) {
  return typeof t == 'string' && qt.hasOwnProperty(t) ? t : e;
}
function Oa(t, e, r, n) {
  let s = ['config', `--${n}`];
  return (
    r && s.push('--add'),
    s.push(t, e),
    {
      commands: s,
      format: 'utf-8',
      parser(i) {
        return i;
      },
    }
  );
}
function Ta(t, e) {
  let r = ['config', '--null', '--show-origin', '--get-all', t];
  return (
    e && r.splice(1, 0, `--${e}`),
    {
      commands: r,
      format: 'utf-8',
      parser(n) {
        return ka(n, t);
      },
    }
  );
}
function Aa(t) {
  let e = ['config', '--list', '--show-origin', '--null'];
  return (
    t && e.push(`--${t}`),
    {
      commands: e,
      format: 'utf-8',
      parser(r) {
        return va(r);
      },
    }
  );
}
function Sa() {
  return {
    addConfig(t, e, ...r) {
      return this._runTask(Oa(t, e, r[0] === !0, $t(r[1], 'local')), A(arguments));
    },
    getConfig(t, e) {
      return this._runTask(Ta(t, $t(e, void 0)), A(arguments));
    },
    listConfig(...t) {
      return this._runTask(Aa($t(t[0], void 0)), A(arguments));
    },
  };
}
var qt,
  hs = p({
    'src/lib/tasks/config.ts'() {
      wa(),
        b(),
        (qt = ((t) => (
          (t.system = 'system'), (t.global = 'global'), (t.local = 'local'), (t.worktree = 'worktree'), t
        ))(qt || {}));
    },
  });
function Ea(...t) {
  return new ps().param(...t);
}
function xa(t) {
  let e = new Set(),
    r = {};
  return (
    Jt(t, (n) => {
      let [s, i, o] = n.split(_e);
      e.add(s), (r[s] = r[s] || []).push({ line: O(i), path: s, preview: o });
    }),
    { paths: e, results: r }
  );
}
function Fa() {
  return {
    grep(t) {
      let e = A(arguments),
        r = L(arguments);
      for (let s of fs) if (r.includes(s)) return this._runTask(N(`git.grep: use of "${s}" is not supported.`), e);
      typeof t == 'string' && (t = Ea().param(t));
      let n = ['grep', '--null', '-n', '--full-name', ...r, ...t];
      return this._runTask(
        {
          commands: n,
          format: 'utf-8',
          parser(s) {
            return xa(s);
          },
        },
        e
      );
    },
  };
}
var fs,
  ke,
  rn,
  ps,
  ms = p({
    'src/lib/tasks/grep.ts'() {
      b(),
        E(),
        (fs = ['-h']),
        (ke = Symbol('grepQuery')),
        (ps = class {
          constructor() {
            this[rn] = [];
          }
          *[((rn = ke), Symbol.iterator)]() {
            for (let t of this[ke]) yield t;
          }
          and(...t) {
            return t.length && this[ke].push('--and', '(', ...Oe(t, '-e'), ')'), this;
          }
          param(...t) {
            return this[ke].push(...Oe(t, '-e')), this;
          }
        });
    },
  }),
  ds = {};
x(ds, { ResetMode: () => Ue, getResetMode: () => Pa, resetTask: () => Ra });
function Ra(t, e) {
  let r = ['reset'];
  return gs(t) && r.push(`--${t}`), r.push(...e), I(r);
}
function Pa(t) {
  if (gs(t)) return t;
  switch (typeof t) {
    case 'string':
    case 'undefined':
      return 'soft';
  }
}
function gs(t) {
  return _s.includes(t);
}
var Ue,
  _s,
  bs = p({
    'src/lib/tasks/reset.ts'() {
      E(),
        (Ue = ((t) => (
          (t.MIXED = 'mixed'), (t.SOFT = 'soft'), (t.HARD = 'hard'), (t.MERGE = 'merge'), (t.KEEP = 'keep'), t
        ))(Ue || {})),
        (_s = Array.from(Object.values(Ue)));
    },
  });
function $a() {
  return (0, Ye.default)('simple-git');
}
function nn(t, e, r) {
  return !e || !String(e).replace(/\s*/, '')
    ? r
      ? (n, ...s) => {
          t(n, ...s), r(n, ...s);
        }
      : t
    : (n, ...s) => {
        t(`%s ${n}`, e, ...s), r && r(n, ...s);
      };
}
function Ma(t, e, { namespace: r }) {
  if (typeof t == 'string') return t;
  let n = (e && e.namespace) || '';
  return n.startsWith(r) ? n.substr(r.length + 1) : n || r;
}
function cr(t, e, r, n = $a()) {
  let s = (t && `[${t}]`) || '',
    i = [],
    o = typeof e == 'string' ? n.extend(e) : e,
    a = Ma(K(e, M), o, n);
  return c(r);
  function u(l, h) {
    return k(i, cr(t, a.replace(/^[^:]+/, l), h, n));
  }
  function c(l) {
    let h = (l && `[${l}]`) || '',
      m = (o && nn(o, h)) || ue,
      d = nn(n, `${s} ${h}`, m);
    return Object.assign(o ? m : d, { label: t, sibling: u, info: d, step: c });
  }
}
var ys = p({
    'src/lib/git-logger.ts'() {
      b(),
        (Ye.default.formatters.L = (t) => String(tr(t) ? t.length : '-')),
        (Ye.default.formatters.B = (t) => (Buffer.isBuffer(t) ? t.toString('utf8') : Fe(t)));
    },
  }),
  Be,
  Gt,
  Da = p({
    'src/lib/runners/tasks-pending-queue.ts'() {
      te(),
        ys(),
        (Be = class {
          constructor(t = 'GitExecutor') {
            (this.logLabel = t), (this._queue = new Map());
          }
          withProgress(t) {
            return this._queue.get(t);
          }
          createProgress(t) {
            let e = Be.getName(t.commands[0]),
              r = cr(this.logLabel, e);
            return { task: t, logger: r, name: e };
          }
          push(t) {
            let e = this.createProgress(t);
            return e.logger('Adding task to the queue, commands = %o', t.commands), this._queue.set(t, e), e;
          }
          fatal(t) {
            for (let [e, { logger: r }] of Array.from(this._queue.entries()))
              e === t.task
                ? (r.info('Failed %o', t),
                  r('Fatal exception, any as-yet un-started tasks run through this executor will not be attempted'))
                : r.info('A fatal exception occurred in a previous task, the queue has been purged: %o', t.message),
                this.complete(e);
            if (this._queue.size !== 0) throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
          }
          complete(t) {
            this.withProgress(t) && this._queue.delete(t);
          }
          attempt(t) {
            let e = this.withProgress(t);
            if (!e) throw new J(void 0, 'TasksPendingQueue: attempt called for an unknown task');
            return e.logger('Starting task'), e;
          }
          static getName(t = 'empty') {
            return `task:${t}:${++Be.counter}`;
          }
        }),
        (Gt = Be),
        (Gt.counter = 0);
    },
  });
function de(t, e) {
  return { method: Ln(t.commands) || '', commands: e };
}
function Ia(t, e) {
  return (r) => {
    e('[ERROR] child process exception %o', r), t.push(Buffer.from(String(r.stack), 'ascii'));
  };
}
function sn(t, e, r, n) {
  return (s) => {
    r('%s received %L bytes', e, s), n('%B', s), t.push(s);
  };
}
var Ut,
  La = p({
    'src/lib/runners/git-executor-chain.ts'() {
      te(),
        E(),
        b(),
        Da(),
        (Ut = class {
          constructor(t, e, r) {
            (this._executor = t),
              (this._scheduler = e),
              (this._plugins = r),
              (this._chain = Promise.resolve()),
              (this._queue = new Gt());
          }
          get binary() {
            return this._executor.binary;
          }
          get cwd() {
            return this._cwd || this._executor.cwd;
          }
          set cwd(t) {
            this._cwd = t;
          }
          get env() {
            return this._executor.env;
          }
          get outputHandler() {
            return this._executor.outputHandler;
          }
          chain() {
            return this;
          }
          push(t) {
            return this._queue.push(t), (this._chain = this._chain.then(() => this.attemptTask(t)));
          }
          attemptTask(t) {
            return Ce(this, null, function* () {
              let e = yield this._scheduler.next(),
                r = () => this._queue.complete(t);
              try {
                let { logger: n } = this._queue.attempt(t);
                return yield is(t) ? this.attemptEmptyTask(t, n) : this.attemptRemoteTask(t, n);
              } catch (n) {
                throw this.onFatalException(t, n);
              } finally {
                r(), e();
              }
            });
          }
          onFatalException(t, e) {
            let r = e instanceof J ? Object.assign(e, { task: t }) : new J(t, e && String(e));
            return (this._chain = Promise.resolve()), this._queue.fatal(r), r;
          }
          attemptRemoteTask(t, e) {
            return Ce(this, null, function* () {
              let r = this._plugins.exec('spawn.args', [...t.commands], de(t, t.commands)),
                n = yield this.gitResponse(t, this.binary, r, this.outputHandler, e.step('SPAWN')),
                s = yield this.handleTaskData(t, r, n, e.step('HANDLE'));
              return (
                e("passing response to task's parser as a %s", t.format),
                ss(t) ? Ht(t.parser, s) : Ht(t.parser, s.asStrings())
              );
            });
          }
          attemptEmptyTask(t, e) {
            return Ce(this, null, function* () {
              return e("empty task bypassing child process to call to task's parser"), t.parser(this);
            });
          }
          handleTaskData(t, e, r, n) {
            let { exitCode: s, rejection: i, stdOut: o, stdErr: a } = r;
            return new Promise((u, c) => {
              n('Preparing to handle process response exitCode=%d stdOut=', s);
              let { error: l } = this._plugins.exec('task.error', { error: i }, G(G({}, de(t, e)), r));
              if (l && t.onError)
                return (
                  n.info('exitCode=%s handling with custom error handler'),
                  t.onError(
                    r,
                    l,
                    (h) => {
                      n.info('custom error handler treated as success'),
                        n('custom error returned a %s', Fe(h)),
                        u(new Ae(Array.isArray(h) ? Buffer.concat(h) : h, Buffer.concat(a)));
                    },
                    c
                  )
                );
              if (l) return n.info('handling as error: exitCode=%s stdErr=%s rejection=%o', s, a.length, i), c(l);
              n.info('retrieving task output complete'), u(new Ae(Buffer.concat(o), Buffer.concat(a)));
            });
          }
          gitResponse(t, e, r, n, s) {
            return Ce(this, null, function* () {
              let i = s.sibling('output'),
                o = this._plugins.exec(
                  'spawn.options',
                  { cwd: this.cwd, env: this.env, windowsHide: !0 },
                  de(t, t.commands)
                );
              return new Promise((a) => {
                let u = [],
                  c = [];
                s.info('%s %o', e, r), s('%O', o);
                let l = this._beforeSpawn(t, r);
                if (l) return a({ stdOut: u, stdErr: c, exitCode: 9901, rejection: l });
                this._plugins.exec(
                  'spawn.before',
                  void 0,
                  we(G({}, de(t, r)), {
                    kill(m) {
                      l = m || l;
                    },
                  })
                );
                let h = (0, vs.spawn)(e, r, o);
                h.stdout.on('data', sn(u, 'stdOut', s, i.step('stdOut'))),
                  h.stderr.on('data', sn(c, 'stdErr', s, i.step('stdErr'))),
                  h.on('error', Ia(c, s)),
                  n &&
                    (s('Passing child process stdOut/stdErr to custom outputHandler'),
                    n(e, h.stdout, h.stderr, [...r])),
                  this._plugins.exec(
                    'spawn.after',
                    void 0,
                    we(G({}, de(t, r)), {
                      spawned: h,
                      close(m, d) {
                        a({ stdOut: u, stdErr: c, exitCode: m, rejection: l || d });
                      },
                      kill(m) {
                        h.killed || ((l = m), h.kill('SIGINT'));
                      },
                    })
                  );
              });
            });
          }
          _beforeSpawn(t, e) {
            let r;
            return (
              this._plugins.exec(
                'spawn.before',
                void 0,
                we(G({}, de(t, e)), {
                  kill(n) {
                    r = n || r;
                  },
                })
              ),
              r
            );
          }
        });
    },
  }),
  ks = {};
x(ks, { GitExecutor: () => Cs });
var Cs,
  Na = p({
    'src/lib/runners/git-executor.ts'() {
      La(),
        (Cs = class {
          constructor(t = 'git', e, r, n) {
            (this.binary = t),
              (this.cwd = e),
              (this._scheduler = r),
              (this._plugins = n),
              (this._chain = new Ut(this, this._scheduler, this._plugins));
          }
          chain() {
            return new Ut(this, this._scheduler, this._plugins);
          }
          push(t) {
            return this._chain.push(t);
          }
        });
    },
  });
function ja(t, e, r = ue) {
  let n = (i) => {
      r(null, i);
    },
    s = (i) => {
      i?.task === t && r(i instanceof Ee ? Ha(i) : i, void 0);
    };
  e.then(n, s);
}
function Ha(t) {
  let e = (n) => {
    console.warn(
      `simple-git deprecation notice: accessing GitResponseError.${n} should be GitResponseError.git.${n}, this will no longer be available in version 3`
    ),
      (e = ue);
  };
  return Object.create(t, Object.getOwnPropertyNames(t.git).reduce(r, {}));
  function r(n, s) {
    return (
      s in t ||
        (n[s] = {
          enumerable: !1,
          configurable: !1,
          get() {
            return e(s), t.git[s];
          },
        }),
      n
    );
  }
}
var Va = p({
  'src/lib/task-callback.ts'() {
    be(), b();
  },
});
function on(t, e) {
  return rs((r) => {
    if (!Xt(t)) throw new Error(`Git.cwd: cannot change to non-directory "${t}"`);
    return ((e || r).cwd = t);
  });
}
var Ba = p({
  'src/lib/tasks/change-working-directory.ts'() {
    b(), E();
  },
});
function Mt(t) {
  let e = ['checkout', ...t];
  return e[1] === '-b' && e.includes('-B') && (e[1] = tt(e, '-B')), I(e);
}
function qa() {
  return {
    checkout() {
      return this._runTask(Mt(L(arguments, 1)), A(arguments));
    },
    checkoutBranch(t, e) {
      return this._runTask(Mt(['-b', t, e, ...L(arguments)]), A(arguments));
    },
    checkoutLocalBranch(t) {
      return this._runTask(Mt(['-b', t, ...L(arguments)]), A(arguments));
    },
  };
}
var Ga = p({
  'src/lib/tasks/checkout.ts'() {
    b(), E();
  },
});
function Ua(t) {
  return B(
    { author: null, branch: '', commit: '', root: !1, summary: { changes: 0, insertions: 0, deletions: 0 } },
    ws,
    t
  );
}
var ws,
  Wa = p({
    'src/lib/parsers/parse-commit.ts'() {
      b(),
        (ws = [
          new y(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (t, [e, r, n]) => {
            (t.branch = e), (t.commit = n), (t.root = !!r);
          }),
          new y(/\s*Author:\s(.+)/i, (t, [e]) => {
            let r = e.split('<'),
              n = r.pop();
            !n || !n.includes('@') || (t.author = { email: n.substr(0, n.length - 1), name: r.join('<').trim() });
          }),
          new y(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g, (t, [e, r, n]) => {
            (t.summary.changes = parseInt(e, 10) || 0),
              (t.summary.insertions = parseInt(r, 10) || 0),
              (t.summary.deletions = parseInt(n, 10) || 0);
          }),
          new y(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/, (t, [e, r, n]) => {
            t.summary.changes = parseInt(e, 10) || 0;
            let s = parseInt(r, 10) || 0;
            n === '-' ? (t.summary.deletions = s) : n === '+' && (t.summary.insertions = s);
          }),
        ]);
    },
  });
function za(t, e, r) {
  return { commands: ['-c', 'core.abbrev=40', 'commit', ...Oe(t, '-m'), ...e, ...r], format: 'utf-8', parser: Ua };
}
function Ka() {
  return {
    commit(e, ...r) {
      let n = A(arguments),
        s = t(e) || za(ee(e), ee(K(r[0], Qe, [])), [...K(r[1], Re, []), ...L(arguments, 0, !0)]);
      return this._runTask(s, n);
    },
  };
  function t(e) {
    return !Qe(e) && N('git.commit: requires the commit message to be supplied as a string/string[]');
  }
}
var Qa = p({
  'src/lib/tasks/commit.ts'() {
    Wa(), b(), E();
  },
});
function Ya() {
  return {
    firstCommit() {
      return this._runTask(I(['rev-list', '--max-parents=0', 'HEAD'], !0), A(arguments));
    },
  };
}
var Ja = p({
  'src/lib/tasks/first-commit.ts'() {
    b(), E();
  },
});
function Xa(t, e) {
  let r = ['hash-object', t];
  return e && r.push('-w'), I(r, !0);
}
var Za = p({
  'src/lib/tasks/hash-object.ts'() {
    E();
  },
});
function eu(t, e, r) {
  let n = String(r).trim(),
    s;
  if ((s = Os.exec(n))) return new We(t, e, !1, s[1]);
  if ((s = Ts.exec(n))) return new We(t, e, !0, s[1]);
  let i = '',
    o = n.split(' ');
  for (; o.length; )
    if (o.shift() === 'in') {
      i = o.join(' ');
      break;
    }
  return new We(t, e, /^re/i.test(n), i);
}
var We,
  Os,
  Ts,
  tu = p({
    'src/lib/responses/InitSummary.ts'() {
      (We = class {
        constructor(t, e, r, n) {
          (this.bare = t), (this.path = e), (this.existing = r), (this.gitDir = n);
        }
      }),
        (Os = /^Init.+ repository in (.+)$/),
        (Ts = /^Rein.+ in (.+)$/);
    },
  });
function ru(t) {
  return t.includes(lr);
}
function nu(t = !1, e, r) {
  let n = ['init', ...r];
  return (
    t && !ru(n) && n.splice(1, 0, lr),
    {
      commands: n,
      format: 'utf-8',
      parser(s) {
        return eu(n.includes('--bare'), e, s);
      },
    }
  );
}
var lr,
  su = p({
    'src/lib/tasks/init.ts'() {
      tu(), (lr = '--bare');
    },
  });
function hr(t) {
  for (let e = 0; e < t.length; e++) {
    let r = fr.exec(t[e]);
    if (r) return `--${r[1]}`;
  }
  return '';
}
function iu(t) {
  return fr.test(t);
}
var fr,
  Pe = p({
    'src/lib/args/log-format.ts'() {
      fr = /^--(stat|numstat|name-only|name-status)(=|$)/;
    },
  }),
  As,
  ou = p({
    'src/lib/responses/DiffSummary.ts'() {
      As = class {
        constructor() {
          (this.changed = 0), (this.deletions = 0), (this.insertions = 0), (this.files = []);
        }
      };
    },
  });
function Ss(t = '') {
  let e = Es[t];
  return (r) => B(new As(), e, r, !1);
}
var Dt,
  an,
  un,
  cn,
  Es,
  xs = p({
    'src/lib/parsers/parse-diff-summary.ts'() {
      Pe(),
        ou(),
        b(),
        (Dt = [
          new y(/(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/, (t, [e, r, n = '']) => {
            t.files.push({
              file: e.trim(),
              changes: O(r),
              insertions: n.replace(/[^+]/g, '').length,
              deletions: n.replace(/[^-]/g, '').length,
              binary: !1,
            });
          }),
          new y(/(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/, (t, [e, r, n]) => {
            t.files.push({ file: e.trim(), before: O(r), after: O(n), binary: !0 });
          }),
          new y(/(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/, (t, [e, r]) => {
            let n = /(\d+) i/.exec(r),
              s = /(\d+) d/.exec(r);
            (t.changed = O(e)), (t.insertions = O(n?.[1])), (t.deletions = O(s?.[1]));
          }),
        ]),
        (an = [
          new y(/(\d+)\t(\d+)\t(.+)$/, (t, [e, r, n]) => {
            let s = O(e),
              i = O(r);
            t.changed++,
              (t.insertions += s),
              (t.deletions += i),
              t.files.push({ file: n, changes: s + i, insertions: s, deletions: i, binary: !1 });
          }),
          new y(/-\t-\t(.+)$/, (t, [e]) => {
            t.changed++, t.files.push({ file: e, after: 0, before: 0, binary: !0 });
          }),
        ]),
        (un = [
          new y(/(.+)$/, (t, [e]) => {
            t.changed++, t.files.push({ file: e, changes: 0, insertions: 0, deletions: 0, binary: !1 });
          }),
        ]),
        (cn = [
          new y(/([ACDMRTUXB])\s*(.+)$/, (t, [e, r]) => {
            t.changed++, t.files.push({ file: r, changes: 0, insertions: 0, deletions: 0, binary: !1 });
          }),
        ]),
        (Es = { '': Dt, '--stat': Dt, '--numstat': an, '--name-status': cn, '--name-only': un });
    },
  });
function au(t, e) {
  return e.reduce((r, n, s) => ((r[n] = t[s] || ''), r), Object.create({ diff: null }));
}
function Fs(t = dr, e = Rs, r = '') {
  let n = Ss(r);
  return function (s) {
    let i = xe(s, !0, pr).map(function (o) {
      let a = o.trim().split(mr),
        u = au(a[0].trim().split(t), e);
      return a.length > 1 && a[1].trim() && (u.diff = n(a[1])), u;
    });
    return { all: i, latest: (i.length && i[0]) || null, total: i.length };
  };
}
var pr,
  mr,
  dr,
  Rs,
  Ps = p({
    'src/lib/parsers/parse-list-log-summary.ts'() {
      b(),
        xs(),
        Pe(),
        (pr = '\xF2\xF2\xF2\xF2\xF2\xF2 '),
        (mr = ' \xF2\xF2'),
        (dr = ' \xF2 '),
        (Rs = ['hash', 'date', 'message', 'refs', 'author_name', 'author_email']);
    },
  }),
  $s = {};
x($s, { diffSummaryTask: () => uu, validateLogFormatConfig: () => it });
function uu(t) {
  let e = hr(t),
    r = ['diff'];
  return (
    e === '' && ((e = '--stat'), r.push('--stat=4096')),
    r.push(...t),
    it(r) || { commands: r, format: 'utf-8', parser: Ss(e) }
  );
}
function it(t) {
  let e = t.filter(iu);
  if (e.length > 1) return N(`Summary flags are mutually exclusive - pick one of ${e.join(',')}`);
  if (e.length && t.includes('-z'))
    return N(`Summary flag ${e} parsing is not compatible with null termination option '-z'`);
}
var gr = p({
  'src/lib/tasks/diff.ts'() {
    Pe(), xs(), E();
  },
});
function cu(t, e) {
  let r = [],
    n = [];
  return (
    Object.keys(t).forEach((s) => {
      r.push(s), n.push(String(t[s]));
    }),
    [r, n.join(e)]
  );
}
function lu(t) {
  return Object.keys(t).reduce((e, r) => (r in Wt || (e[r] = t[r]), e), {});
}
function Ms(t = {}, e = []) {
  let r = K(t.splitter, M, dr),
    n =
      !Zt(t.format) && t.format
        ? t.format
        : {
            hash: '%H',
            date: t.strictDate === !1 ? '%ai' : '%aI',
            message: '%s',
            refs: '%D',
            body: t.multiLine ? '%B' : '%b',
            author_name: t.mailMap !== !1 ? '%aN' : '%an',
            author_email: t.mailMap !== !1 ? '%aE' : '%ae',
          },
    [s, i] = cu(n, r),
    o = [],
    a = [`--pretty=format:${pr}${i}${mr}`, ...e],
    u = t.n || t['max-count'] || t.maxCount;
  if ((u && a.push(`--max-count=${u}`), t.from || t.to)) {
    let c = t.symmetric !== !1 ? '...' : '..';
    o.push(`${t.from || ''}${c}${t.to || ''}`);
  }
  return M(t.file) && a.push('--follow', ra(t.file)), rr(lu(t), a), { fields: s, splitter: r, commands: [...a, ...o] };
}
function hu(t, e, r) {
  let n = Fs(t, e, hr(r));
  return { commands: ['log', ...r], format: 'utf-8', parser: n };
}
function fu() {
  return {
    log(...r) {
      let n = A(arguments),
        s = Ms(nr(arguments), K(arguments[0], Re)),
        i = e(...r) || it(s.commands) || t(s);
      return this._runTask(i, n);
    },
  };
  function t(r) {
    return hu(r.splitter, r.fields, r.commands);
  }
  function e(r, n) {
    return M(r) && M(n) && N('git.log(string, string) should be replaced with git.log({ from: string, to: string })');
  }
}
var Wt,
  Ds = p({
    'src/lib/tasks/log.ts'() {
      Pe(),
        Se(),
        Ps(),
        b(),
        E(),
        gr(),
        (Wt = ((t) => (
          (t[(t['--pretty'] = 0)] = '--pretty'),
          (t[(t['max-count'] = 1)] = 'max-count'),
          (t[(t.maxCount = 2)] = 'maxCount'),
          (t[(t.n = 3)] = 'n'),
          (t[(t.file = 4)] = 'file'),
          (t[(t.format = 5)] = 'format'),
          (t[(t.from = 6)] = 'from'),
          (t[(t.to = 7)] = 'to'),
          (t[(t.splitter = 8)] = 'splitter'),
          (t[(t.symmetric = 9)] = 'symmetric'),
          (t[(t.mailMap = 10)] = 'mailMap'),
          (t[(t.multiLine = 11)] = 'multiLine'),
          (t[(t.strictDate = 12)] = 'strictDate'),
          t
        ))(Wt || {}));
    },
  }),
  ze,
  Is,
  pu = p({
    'src/lib/responses/MergeSummary.ts'() {
      (ze = class {
        constructor(t, e = null, r) {
          (this.reason = t), (this.file = e), (this.meta = r);
        }
        toString() {
          return `${this.file}:${this.reason}`;
        }
      }),
        (Is = class {
          constructor() {
            (this.conflicts = []), (this.merges = []), (this.result = 'success');
          }
          get failed() {
            return this.conflicts.length > 0;
          }
          get reason() {
            return this.result;
          }
          toString() {
            return this.conflicts.length ? `CONFLICTS: ${this.conflicts.join(', ')}` : 'OK';
          }
        });
    },
  }),
  zt,
  Ls,
  mu = p({
    'src/lib/responses/PullSummary.ts'() {
      (zt = class {
        constructor() {
          (this.remoteMessages = { all: [] }),
            (this.created = []),
            (this.deleted = []),
            (this.files = []),
            (this.deletions = {}),
            (this.insertions = {}),
            (this.summary = { changes: 0, deletions: 0, insertions: 0 });
        }
      }),
        (Ls = class {
          constructor() {
            (this.remote = ''),
              (this.hash = { local: '', remote: '' }),
              (this.branch = { local: '', remote: '' }),
              (this.message = '');
          }
          toString() {
            return this.message;
          }
        });
    },
  });
function It(t) {
  return (t.objects = t.objects || {
    compressing: 0,
    counting: 0,
    enumerating: 0,
    packReused: 0,
    reused: { count: 0, delta: 0 },
    total: { count: 0, delta: 0 },
  });
}
function ln(t) {
  let e = /^\s*(\d+)/.exec(t),
    r = /delta (\d+)/i.exec(t);
  return { count: O((e && e[1]) || '0'), delta: O((r && r[1]) || '0') };
}
var Ns,
  du = p({
    'src/lib/parsers/parse-remote-objects.ts'() {
      b(),
        (Ns = [
          new Z(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i, (t, [e, r]) => {
            let n = e.toLowerCase(),
              s = It(t.remoteMessages);
            Object.assign(s, { [n]: O(r) });
          }),
          new Z(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i, (t, [e, r]) => {
            let n = e.toLowerCase(),
              s = It(t.remoteMessages);
            Object.assign(s, { [n]: O(r) });
          }),
          new Z(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i, (t, [e, r, n]) => {
            let s = It(t.remoteMessages);
            (s.total = ln(e)), (s.reused = ln(r)), (s.packReused = O(n));
          }),
        ]);
    },
  });
function js(t, e) {
  return B({ remoteMessages: new Vs() }, Hs, e);
}
var Hs,
  Vs,
  Bs = p({
    'src/lib/parsers/parse-remote-messages.ts'() {
      b(),
        du(),
        (Hs = [
          new Z(/^remote:\s*(.+)$/, (t, [e]) => (t.remoteMessages.all.push(e.trim()), !1)),
          ...Ns,
          new Z([/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/], (t, [e]) => {
            t.remoteMessages.pullRequestUrl = e;
          }),
          new Z([/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/], (t, [e, r, n]) => {
            t.remoteMessages.vulnerabilities = { count: O(e), summary: r, url: n };
          }),
        ]),
        (Vs = class {
          constructor() {
            this.all = [];
          }
        });
    },
  });
function gu(t, e) {
  let r = B(new Ls(), qs, [t, e]);
  return r.message && r;
}
var hn,
  fn,
  pn,
  mn,
  qs,
  dn,
  _r,
  Gs = p({
    'src/lib/parsers/parse-pull.ts'() {
      mu(),
        b(),
        Bs(),
        (hn = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/),
        (fn = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/),
        (pn = /^(create|delete) mode \d+ (.+)/),
        (mn = [
          new y(hn, (t, [e, r, n]) => {
            t.files.push(e), r && (t.insertions[e] = r.length), n && (t.deletions[e] = n.length);
          }),
          new y(fn, (t, [e, , r, , n]) =>
            r !== void 0 || n !== void 0
              ? ((t.summary.changes = +e || 0), (t.summary.insertions = +r || 0), (t.summary.deletions = +n || 0), !0)
              : !1
          ),
          new y(pn, (t, [e, r]) => {
            k(t.files, r), k(e === 'create' ? t.created : t.deleted, r);
          }),
        ]),
        (qs = [
          new y(/^from\s(.+)$/i, (t, [e]) => void (t.remote = e)),
          new y(/^fatal:\s(.+)$/, (t, [e]) => void (t.message = e)),
          new y(/([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/, (t, [e, r, n, s]) => {
            (t.branch.local = n), (t.hash.local = e), (t.branch.remote = s), (t.hash.remote = r);
          }),
        ]),
        (dn = (t, e) => B(new zt(), mn, [t, e])),
        (_r = (t, e) => Object.assign(new zt(), dn(t, e), js(t, e)));
    },
  }),
  gn,
  Us,
  _n,
  _u = p({
    'src/lib/parsers/parse-merge.ts'() {
      pu(),
        b(),
        Gs(),
        (gn = [
          new y(/^Auto-merging\s+(.+)$/, (t, [e]) => {
            t.merges.push(e);
          }),
          new y(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/, (t, [e, r]) => {
            t.conflicts.push(new ze(e, r));
          }),
          new y(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/, (t, [e, r, n]) => {
            t.conflicts.push(new ze(e, r, { deleteRef: n }));
          }),
          new y(/^CONFLICT\s+\((.+)\):/, (t, [e]) => {
            t.conflicts.push(new ze(e, null));
          }),
          new y(/^Automatic merge failed;\s+(.+)$/, (t, [e]) => {
            t.result = e;
          }),
        ]),
        (Us = (t, e) => Object.assign(_n(t, e), _r(t, e))),
        (_n = (t) => B(new Is(), gn, t));
    },
  });
function bn(t) {
  return t.length
    ? {
        commands: ['merge', ...t],
        format: 'utf-8',
        parser(e, r) {
          let n = Us(e, r);
          if (n.failed) throw new Ee(n);
          return n;
        },
      }
    : N('Git.merge requires at least one option');
}
var bu = p({
  'src/lib/tasks/merge.ts'() {
    be(), _u(), E();
  },
});
function yu(t, e, r) {
  let n = r.includes('deleted'),
    s = r.includes('tag') || /^refs\/tags/.test(t),
    i = !r.includes('new');
  return { deleted: n, tag: s, branch: !s, new: !i, alreadyUpdated: i, local: t, remote: e };
}
var yn,
  Ws,
  vn,
  vu = p({
    'src/lib/parsers/parse-push.ts'() {
      b(),
        Bs(),
        (yn = [
          new y(/^Pushing to (.+)$/, (t, [e]) => {
            t.repo = e;
          }),
          new y(/^updating local tracking ref '(.+)'/, (t, [e]) => {
            t.ref = we(G({}, t.ref || {}), { local: e });
          }),
          new y(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/, (t, [e, r, n]) => {
            t.pushed.push(yu(e, r, n));
          }),
          new y(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/, (t, [e, r, n]) => {
            t.branch = we(G({}, t.branch || {}), { local: e, remote: r, remoteName: n });
          }),
          new y(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/, (t, [e, r, n, s]) => {
            t.update = { head: { local: e, remote: r }, hash: { from: n, to: s } };
          }),
        ]),
        (Ws = (t, e) => {
          let r = vn(t, e),
            n = js(t, e);
          return G(G({}, r), n);
        }),
        (vn = (t, e) => B({ pushed: [] }, yn, [t, e]));
    },
  }),
  zs = {};
x(zs, { pushTagsTask: () => ku, pushTask: () => br });
function ku(t = {}, e) {
  return k(e, '--tags'), br(t, e);
}
function br(t = {}, e) {
  let r = ['push', ...e];
  return (
    t.branch && r.splice(1, 0, t.branch),
    t.remote && r.splice(1, 0, t.remote),
    tt(r, '-v'),
    k(r, '--verbose'),
    k(r, '--porcelain'),
    { commands: r, format: 'utf-8', parser: Ws }
  );
}
var Ks = p({
  'src/lib/tasks/push.ts'() {
    vu(), b();
  },
});
function Cu() {
  return {
    showBuffer() {
      let t = ['show', ...L(arguments, 1)];
      return t.includes('--binary') || t.splice(1, 0, '--binary'), this._runTask(ns(t), A(arguments));
    },
    show() {
      let t = ['show', ...L(arguments, 1)];
      return this._runTask(I(t), A(arguments));
    },
  };
}
var wu = p({
    'src/lib/tasks/show.ts'() {
      b(), E();
    },
  }),
  kn,
  Qs,
  Ou = p({
    'src/lib/responses/FileStatusSummary.ts'() {
      (kn = /^(.+) -> (.+)$/),
        (Qs = class {
          constructor(t, e, r) {
            if (((this.path = t), (this.index = e), (this.working_dir = r), e + r === 'R')) {
              let n = kn.exec(t) || [null, t, t];
              (this.from = n[1] || ''), (this.path = n[2] || '');
            }
          }
        });
    },
  });
function Cn(t) {
  let [e, r] = t.split(_e);
  return { from: r || e, to: e };
}
function V(t, e, r) {
  return [`${t}${e}`, r];
}
function Lt(t, ...e) {
  return e.map((r) => V(t, r, (n, s) => k(n.conflicted, s)));
}
function Tu(t, e) {
  let r = e.trim();
  switch (' ') {
    case r.charAt(2):
      return n(r.charAt(0), r.charAt(1), r.substr(3));
    case r.charAt(1):
      return n(' ', r.charAt(0), r.substr(2));
    default:
      return;
  }
  function n(s, i, o) {
    let a = `${s}${i}`,
      u = Ys.get(a);
    u && u(t, o), a !== '##' && a !== '!!' && t.files.push(new Qs(o.replace(/\0.+$/, ''), s, i));
  }
}
var wn,
  Ys,
  Js,
  Au = p({
    'src/lib/responses/StatusSummary.ts'() {
      b(),
        Ou(),
        (wn = class {
          constructor() {
            (this.not_added = []),
              (this.conflicted = []),
              (this.created = []),
              (this.deleted = []),
              (this.ignored = void 0),
              (this.modified = []),
              (this.renamed = []),
              (this.files = []),
              (this.staged = []),
              (this.ahead = 0),
              (this.behind = 0),
              (this.current = null),
              (this.tracking = null),
              (this.detached = !1),
              (this.isClean = () => !this.files.length);
          }
        }),
        (Ys = new Map([
          V(' ', 'A', (t, e) => k(t.created, e)),
          V(' ', 'D', (t, e) => k(t.deleted, e)),
          V(' ', 'M', (t, e) => k(t.modified, e)),
          V('A', ' ', (t, e) => k(t.created, e) && k(t.staged, e)),
          V('A', 'M', (t, e) => k(t.created, e) && k(t.staged, e) && k(t.modified, e)),
          V('D', ' ', (t, e) => k(t.deleted, e) && k(t.staged, e)),
          V('M', ' ', (t, e) => k(t.modified, e) && k(t.staged, e)),
          V('M', 'M', (t, e) => k(t.modified, e) && k(t.staged, e)),
          V('R', ' ', (t, e) => {
            k(t.renamed, Cn(e));
          }),
          V('R', 'M', (t, e) => {
            let r = Cn(e);
            k(t.renamed, r), k(t.modified, r.to);
          }),
          V('!', '!', (t, e) => {
            k((t.ignored = t.ignored || []), e);
          }),
          V('?', '?', (t, e) => k(t.not_added, e)),
          ...Lt('A', 'A', 'U'),
          ...Lt('D', 'D', 'U'),
          ...Lt('U', 'A', 'D', 'U'),
          [
            '##',
            (t, e) => {
              let r = /ahead (\d+)/,
                n = /behind (\d+)/,
                s = /^(.+?(?=(?:\.{3}|\s|$)))/,
                i = /\.{3}(\S*)/,
                o = /\son\s([\S]+)$/,
                a;
              (a = r.exec(e)),
                (t.ahead = (a && +a[1]) || 0),
                (a = n.exec(e)),
                (t.behind = (a && +a[1]) || 0),
                (a = s.exec(e)),
                (t.current = a && a[1]),
                (a = i.exec(e)),
                (t.tracking = a && a[1]),
                (a = o.exec(e)),
                (t.current = (a && a[1]) || t.current),
                (t.detached = /\(no branch\)/.test(e));
            },
          ],
        ])),
        (Js = function (t) {
          let e = t.split(_e),
            r = new wn();
          for (let n = 0, s = e.length; n < s; ) {
            let i = e[n++].trim();
            i && (i.charAt(0) === 'R' && (i += _e + (e[n++] || '')), Tu(r, i));
          }
          return r;
        });
    },
  });
function Su(t) {
  return {
    format: 'utf-8',
    commands: ['status', '--porcelain', '-b', '-u', '--null', ...t.filter((r) => !Xs.includes(r))],
    parser(r) {
      return Js(r);
    },
  };
}
var Xs,
  Eu = p({
    'src/lib/tasks/status.ts'() {
      Au(), (Xs = ['--null', '-z']);
    },
  });
function Je(t = 0, e = 0, r = 0, n = '', s = !0) {
  return Object.defineProperty({ major: t, minor: e, patch: r, agent: n, installed: s }, 'toString', {
    value() {
      return `${this.major}.${this.minor}.${this.patch}`;
    },
    configurable: !1,
    enumerable: !1,
  });
}
function xu() {
  return Je(0, 0, 0, '', !1);
}
function Fu() {
  return {
    version() {
      return this._runTask({
        commands: ['--version'],
        format: 'utf-8',
        parser: Ru,
        onError(t, e, r, n) {
          if (t.exitCode === -2) return r(Buffer.from(yr));
          n(e);
        },
      });
    },
  };
}
function Ru(t) {
  return t === yr ? xu() : B(Je(0, 0, 0, t), Zs, t);
}
var yr,
  Zs,
  Pu = p({
    'src/lib/tasks/version.ts'() {
      b(),
        (yr = 'installed=false'),
        (Zs = [
          new y(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/, (t, [e, r, n, s = '']) => {
            Object.assign(t, Je(O(e), O(r), O(n), s));
          }),
          new y(/version (\d+)\.(\d+)\.(\D+)(.+)?$/, (t, [e, r, n, s = '']) => {
            Object.assign(t, Je(O(e), O(r), n, s));
          }),
        ]);
    },
  }),
  ei = {};
x(ei, { SimpleGitApi: () => Kt });
var Kt,
  $u = p({
    'src/lib/simple-git-api.ts'() {
      Va(),
        Ba(),
        Ga(),
        Qa(),
        hs(),
        Ja(),
        ms(),
        Za(),
        su(),
        Ds(),
        bu(),
        Ks(),
        wu(),
        Eu(),
        E(),
        Pu(),
        b(),
        (Kt = class {
          constructor(t) {
            this._executor = t;
          }
          _runTask(t, e) {
            let r = this._executor.chain(),
              n = r.push(t);
            return (
              e && ja(t, n, e),
              Object.create(this, {
                then: { value: n.then.bind(n) },
                catch: { value: n.catch.bind(n) },
                _executor: { value: r },
              })
            );
          }
          add(t) {
            return this._runTask(I(['add', ...ee(t)]), A(arguments));
          }
          cwd(t) {
            let e = A(arguments);
            return typeof t == 'string'
              ? this._runTask(on(t, this._executor), e)
              : typeof t?.path == 'string'
              ? this._runTask(on(t.path, (t.root && this._executor) || void 0), e)
              : this._runTask(N('Git.cwd: workingDirectory must be supplied as a string'), e);
          }
          hashObject(t, e) {
            return this._runTask(Xa(t, e === !0), A(arguments));
          }
          init(t) {
            return this._runTask(nu(t === !0, this._executor.cwd, L(arguments)), A(arguments));
          }
          merge() {
            return this._runTask(bn(L(arguments)), A(arguments));
          }
          mergeFromTo(t, e) {
            return M(t) && M(e)
              ? this._runTask(bn([t, e, ...L(arguments)]), A(arguments, !1))
              : this._runTask(
                  N("Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings")
                );
          }
          outputHandler(t) {
            return (this._executor.outputHandler = t), this;
          }
          push() {
            let t = br({ remote: K(arguments[0], M), branch: K(arguments[1], M) }, L(arguments));
            return this._runTask(t, A(arguments));
          }
          stash() {
            return this._runTask(I(['stash', ...L(arguments)]), A(arguments));
          }
          status() {
            return this._runTask(Su(L(arguments)), A(arguments));
          }
        }),
        Object.assign(Kt.prototype, qa(), Ka(), Sa(), Ya(), Fa(), fu(), Cu(), Fu());
    },
  }),
  ti = {};
x(ti, { Scheduler: () => ni });
var On,
  ni,
  Mu = p({
    'src/lib/runners/scheduler.ts'() {
      b(),
        ys(),
        (On = (() => {
          let t = 0;
          return () => {
            t++;
            let { promise: e, done: r } = (0, ri.createDeferred)();
            return { promise: e, done: r, id: t };
          };
        })()),
        (ni = class {
          constructor(t = 2) {
            (this.concurrency = t),
              (this.logger = cr('', 'scheduler')),
              (this.pending = []),
              (this.running = []),
              this.logger('Constructed, concurrency=%s', t);
          }
          schedule() {
            if (!this.pending.length || this.running.length >= this.concurrency) {
              this.logger(
                'Schedule attempt ignored, pending=%s running=%s concurrency=%s',
                this.pending.length,
                this.running.length,
                this.concurrency
              );
              return;
            }
            let t = k(this.running, this.pending.shift());
            this.logger('Attempting id=%s', t.id),
              t.done(() => {
                this.logger('Completing id=', t.id), tt(this.running, t), this.schedule();
              });
          }
          next() {
            let { promise: t, id: e } = k(this.pending, On());
            return this.logger('Scheduling id=%s', e), this.schedule(), t;
          }
        });
    },
  }),
  si = {};
x(si, { applyPatchTask: () => Du });
function Du(t, e) {
  return I(['apply', ...e, ...t]);
}
var Iu = p({
  'src/lib/tasks/apply-patch.ts'() {
    E();
  },
});
function Lu(t, e) {
  return { branch: t, hash: e, success: !0 };
}
function Nu(t) {
  return { branch: t, hash: null, success: !1 };
}
var ii,
  ju = p({
    'src/lib/responses/BranchDeleteSummary.ts'() {
      ii = class {
        constructor() {
          (this.all = []), (this.branches = {}), (this.errors = []);
        }
        get success() {
          return !this.errors.length;
        }
      };
    },
  });
function oi(t, e) {
  return e === 1 && Qt.test(t);
}
var Tn,
  Qt,
  An,
  ot,
  Hu = p({
    'src/lib/parsers/parse-branch-delete.ts'() {
      ju(),
        b(),
        (Tn = /(\S+)\s+\(\S+\s([^)]+)\)/),
        (Qt = /^error[^']+'([^']+)'/m),
        (An = [
          new y(Tn, (t, [e, r]) => {
            let n = Lu(e, r);
            t.all.push(n), (t.branches[e] = n);
          }),
          new y(Qt, (t, [e]) => {
            let r = Nu(e);
            t.errors.push(r), t.all.push(r), (t.branches[e] = r);
          }),
        ]),
        (ot = (t, e) => B(new ii(), An, [t, e]));
    },
  }),
  ai,
  Vu = p({
    'src/lib/responses/BranchSummary.ts'() {
      ai = class {
        constructor() {
          (this.all = []), (this.branches = {}), (this.current = ''), (this.detached = !1);
        }
        push(t, e, r, n, s) {
          t === '*' && ((this.detached = e), (this.current = r)),
            this.all.push(r),
            (this.branches[r] = { current: t === '*', linkedWorkTree: t === '+', name: r, commit: n, label: s });
        }
      };
    },
  });
function Sn(t) {
  return t ? t.charAt(0) : '';
}
function ui(t) {
  return B(new ai(), ci, t);
}
var ci,
  Bu = p({
    'src/lib/parsers/parse-branch.ts'() {
      Vu(),
        b(),
        (ci = [
          new y(/^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/, (t, [e, r, n, s]) => {
            t.push(Sn(e), !0, r, n, s);
          }),
          new y(/^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s, (t, [e, r, n, s]) => {
            t.push(Sn(e), !1, r, n, s);
          }),
        ]);
    },
  }),
  li = {};
x(li, {
  branchLocalTask: () => Gu,
  branchTask: () => qu,
  containsDeleteBranchCommand: () => hi,
  deleteBranchTask: () => Wu,
  deleteBranchesTask: () => Uu,
});
function hi(t) {
  let e = ['-d', '-D', '--delete'];
  return t.some((r) => e.includes(r));
}
function qu(t) {
  let e = hi(t),
    r = ['branch', ...t];
  return (
    r.length === 1 && r.push('-a'),
    r.includes('-v') || r.splice(1, 0, '-v'),
    {
      format: 'utf-8',
      commands: r,
      parser(n, s) {
        return e ? ot(n, s).all[0] : ui(n);
      },
    }
  );
}
function Gu() {
  return { format: 'utf-8', commands: ['branch', '-v'], parser: ui };
}
function Uu(t, e = !1) {
  return {
    format: 'utf-8',
    commands: ['branch', '-v', e ? '-D' : '-d', ...t],
    parser(r, n) {
      return ot(r, n);
    },
    onError({ exitCode: r, stdOut: n }, s, i, o) {
      if (!oi(String(s), r)) return o(s);
      i(n);
    },
  };
}
function Wu(t, e = !1) {
  let r = {
    format: 'utf-8',
    commands: ['branch', '-v', e ? '-D' : '-d', t],
    parser(n, s) {
      return ot(n, s).branches[t];
    },
    onError({ exitCode: n, stdErr: s, stdOut: i }, o, a, u) {
      if (!oi(String(o), n)) return u(o);
      throw new Ee(r.parser(Te(i), Te(s)), String(o));
    },
  };
  return r;
}
var zu = p({
    'src/lib/tasks/branch.ts'() {
      be(), Hu(), Bu(), b();
    },
  }),
  fi,
  Ku = p({
    'src/lib/responses/CheckIgnore.ts'() {
      fi = (t) =>
        t
          .split(/\n/g)
          .map((e) => e.trim())
          .filter((e) => !!e);
    },
  }),
  pi = {};
x(pi, { checkIgnoreTask: () => Qu });
function Qu(t) {
  return { commands: ['check-ignore', ...t], format: 'utf-8', parser: fi };
}
var Yu = p({
    'src/lib/tasks/check-ignore.ts'() {
      Ku();
    },
  }),
  mi = {};
x(mi, { cloneMirrorTask: () => Xu, cloneTask: () => di });
function Ju(t) {
  return /^--upload-pack(=|$)/.test(t);
}
function di(t, e, r) {
  let n = ['clone', ...r];
  return M(t) && n.push(t), M(e) && n.push(e), n.find(Ju) ? N('git.fetch: potential exploit argument blocked.') : I(n);
}
function Xu(t, e, r) {
  return k(r, '--mirror'), di(t, e, r);
}
var Zu = p({
  'src/lib/tasks/clone.ts'() {
    E(), b();
  },
});
function ec(t, e) {
  return B({ raw: t, remote: null, branches: [], tags: [], updated: [], deleted: [] }, gi, [t, e]);
}
var gi,
  tc = p({
    'src/lib/parsers/parse-fetch.ts'() {
      b(),
        (gi = [
          new y(/From (.+)$/, (t, [e]) => {
            t.remote = e;
          }),
          new y(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (t, [e, r]) => {
            t.branches.push({ name: e, tracking: r });
          }),
          new y(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (t, [e, r]) => {
            t.tags.push({ name: e, tracking: r });
          }),
          new y(/- \[deleted]\s+\S+\s*-> (.+)$/, (t, [e]) => {
            t.deleted.push({ tracking: e });
          }),
          new y(/\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/, (t, [e, r, n, s]) => {
            t.updated.push({ name: n, tracking: s, to: r, from: e });
          }),
        ]);
    },
  }),
  _i = {};
x(_i, { fetchTask: () => nc });
function rc(t) {
  return /^--upload-pack(=|$)/.test(t);
}
function nc(t, e, r) {
  let n = ['fetch', ...r];
  return (
    t && e && n.push(t, e),
    n.find(rc) ? N('git.fetch: potential exploit argument blocked.') : { commands: n, format: 'utf-8', parser: ec }
  );
}
var sc = p({
  'src/lib/tasks/fetch.ts'() {
    tc(), E();
  },
});
function ic(t) {
  return B({ moves: [] }, bi, t);
}
var bi,
  oc = p({
    'src/lib/parsers/parse-move.ts'() {
      b(),
        (bi = [
          new y(/^Renaming (.+) to (.+)$/, (t, [e, r]) => {
            t.moves.push({ from: e, to: r });
          }),
        ]);
    },
  }),
  yi = {};
x(yi, { moveTask: () => ac });
function ac(t, e) {
  return { commands: ['mv', '-v', ...ee(t), e], format: 'utf-8', parser: ic };
}
var uc = p({
    'src/lib/tasks/move.ts'() {
      oc(), b();
    },
  }),
  vi = {};
x(vi, { pullTask: () => cc });
function cc(t, e, r) {
  let n = ['pull', ...r];
  return (
    t && e && n.splice(1, 0, t, e),
    {
      commands: n,
      format: 'utf-8',
      parser(s, i) {
        return _r(s, i);
      },
      onError(s, i, o, a) {
        let u = gu(Te(s.stdOut), Te(s.stdErr));
        if (u) return a(new Ee(u));
        a(i);
      },
    }
  );
}
var lc = p({
  'src/lib/tasks/pull.ts'() {
    be(), Gs(), b();
  },
});
function hc(t) {
  let e = {};
  return ki(t, ([r]) => (e[r] = { name: r })), Object.values(e);
}
function fc(t) {
  let e = {};
  return (
    ki(t, ([r, n, s]) => {
      e.hasOwnProperty(r) || (e[r] = { name: r, refs: { fetch: '', push: '' } }),
        s && n && (e[r].refs[s.replace(/[^a-z]/g, '')] = n);
    }),
    Object.values(e)
  );
}
function ki(t, e) {
  Jt(t, (r) => e(r.split(/\s+/)));
}
var pc = p({
    'src/lib/responses/GetRemoteSummary.ts'() {
      b();
    },
  }),
  Ci = {};
x(Ci, {
  addRemoteTask: () => mc,
  getRemotesTask: () => dc,
  listRemotesTask: () => gc,
  remoteTask: () => _c,
  removeRemoteTask: () => bc,
});
function mc(t, e, r = []) {
  return I(['remote', 'add', ...r, t, e]);
}
function dc(t) {
  let e = ['remote'];
  return t && e.push('-v'), { commands: e, format: 'utf-8', parser: t ? fc : hc };
}
function gc(t = []) {
  let e = [...t];
  return e[0] !== 'ls-remote' && e.unshift('ls-remote'), I(e);
}
function _c(t = []) {
  let e = [...t];
  return e[0] !== 'remote' && e.unshift('remote'), I(e);
}
function bc(t) {
  return I(['remote', 'remove', t]);
}
var yc = p({
    'src/lib/tasks/remote.ts'() {
      pc(), E();
    },
  }),
  wi = {};
x(wi, { stashListTask: () => vc });
function vc(t = {}, e) {
  let r = Ms(t),
    n = ['stash', 'list', ...r.commands, ...e],
    s = Fs(r.splitter, r.fields, hr(n));
  return it(n) || { commands: n, format: 'utf-8', parser: s };
}
var kc = p({
    'src/lib/tasks/stash-list.ts'() {
      Pe(), Ps(), gr(), Ds();
    },
  }),
  Oi = {};
x(Oi, {
  addSubModuleTask: () => Cc,
  initSubModuleTask: () => wc,
  subModuleTask: () => at,
  updateSubModuleTask: () => Oc,
});
function Cc(t, e) {
  return at(['add', t, e]);
}
function wc(t) {
  return at(['init', ...t]);
}
function at(t) {
  let e = [...t];
  return e[0] !== 'submodule' && e.unshift('submodule'), I(e);
}
function Oc(t) {
  return at(['update', ...t]);
}
var Tc = p({
  'src/lib/tasks/sub-module.ts'() {
    E();
  },
});
function Ac(t, e) {
  let r = isNaN(t),
    n = isNaN(e);
  return r !== n ? (r ? 1 : -1) : r ? Ti(t, e) : 0;
}
function Ti(t, e) {
  return t === e ? 0 : t > e ? 1 : -1;
}
function Sc(t) {
  return t.trim();
}
function qe(t) {
  return (typeof t == 'string' && parseInt(t.replace(/^\D+/g, ''), 10)) || 0;
}
var En,
  Ai,
  Ec = p({
    'src/lib/responses/TagList.ts'() {
      (En = class {
        constructor(t, e) {
          (this.all = t), (this.latest = e);
        }
      }),
        (Ai = function (t, e = !1) {
          let r = t
            .split(
              `
`
            )
            .map(Sc)
            .filter(Boolean);
          e ||
            r.sort(function (s, i) {
              let o = s.split('.'),
                a = i.split('.');
              if (o.length === 1 || a.length === 1) return Ac(qe(o[0]), qe(a[0]));
              for (let u = 0, c = Math.max(o.length, a.length); u < c; u++) {
                let l = Ti(qe(o[u]), qe(a[u]));
                if (l) return l;
              }
              return 0;
            });
          let n = e ? r[0] : [...r].reverse().find((s) => s.indexOf('.') >= 0);
          return new En(r, n);
        });
    },
  }),
  Si = {};
x(Si, { addAnnotatedTagTask: () => Rc, addTagTask: () => Fc, tagListTask: () => xc });
function xc(t = []) {
  let e = t.some((r) => /^--sort=/.test(r));
  return {
    format: 'utf-8',
    commands: ['tag', '-l', ...t],
    parser(r) {
      return Ai(r, e);
    },
  };
}
function Fc(t) {
  return {
    format: 'utf-8',
    commands: ['tag', t],
    parser() {
      return { name: t };
    },
  };
}
function Rc(t, e) {
  return {
    format: 'utf-8',
    commands: ['tag', '-a', '-m', e, t],
    parser() {
      return { name: t };
    },
  };
}
var Pc = p({
    'src/lib/tasks/tag.ts'() {
      Ec();
    },
  }),
  $c = ea({
    'src/git.js'(t, e) {
      var { GitExecutor: r } = (Na(), T(ks)),
        { SimpleGitApi: n } = ($u(), T(ei)),
        { Scheduler: s } = (Mu(), T(ti)),
        { configurationErrorTask: i } = (E(), T(Bt)),
        {
          asArray: o,
          filterArray: a,
          filterPrimitives: u,
          filterString: c,
          filterStringOrStringArray: l,
          filterType: h,
          getTrailingOptions: m,
          trailingFunctionArgument: d,
          trailingOptionsArgument: v,
        } = (b(), T(zn)),
        { applyPatchTask: S } = (Iu(), T(si)),
        { branchTask: F, branchLocalTask: Q, deleteBranchesTask: ce, deleteBranchTask: ct } = (zu(), T(li)),
        { checkIgnoreTask: le } = (Yu(), T(pi)),
        { checkIsRepoTask: kr } = (Jn(), T(Kn)),
        { cloneTask: ye, cloneMirrorTask: lt } = (Zu(), T(mi)),
        { cleanWithOptionsTask: $e, isCleanOptionsArray: ht } = (us(), T(os)),
        { diffSummaryTask: Fi } = (gr(), T($s)),
        { fetchTask: Ri } = (sc(), T(_i)),
        { moveTask: Pi } = (uc(), T(yi)),
        { pullTask: $i } = (lc(), T(vi)),
        { pushTagsTask: Mi } = (Ks(), T(zs)),
        {
          addRemoteTask: Di,
          getRemotesTask: Ii,
          listRemotesTask: Li,
          remoteTask: Ni,
          removeRemoteTask: ji,
        } = (yc(), T(Ci)),
        { getResetMode: Hi, resetTask: Vi } = (bs(), T(ds)),
        { stashListTask: Bi } = (kc(), T(wi)),
        { addSubModuleTask: qi, initSubModuleTask: Gi, subModuleTask: Ui, updateSubModuleTask: Wi } = (Tc(), T(Oi)),
        { addAnnotatedTagTask: zi, addTagTask: Ki, tagListTask: Qi } = (Pc(), T(Si)),
        { straightThroughBufferTask: Yi, straightThroughStringTask: z } = (E(), T(Bt));
      function _(f, g) {
        (this._executor = new r(f.binary, f.baseDir, new s(f.maxConcurrentProcesses), g)), (this._trimmed = f.trimmed);
      }
      ((_.prototype = Object.create(n.prototype)).constructor = _),
        (_.prototype.customBinary = function (f) {
          return (this._executor.binary = f), this;
        }),
        (_.prototype.env = function (f, g) {
          return (
            arguments.length === 1 && typeof f == 'object'
              ? (this._executor.env = f)
              : ((this._executor.env = this._executor.env || {})[f] = g),
            this
          );
        }),
        (_.prototype.stashList = function (f) {
          return this._runTask(Bi(v(arguments) || {}, (a(f) && f) || []), d(arguments));
        });
      function Cr(f, g, C, D) {
        return typeof C != 'string' ? i(`git.${f}() requires a string 'repoPath'`) : g(C, h(D, c), m(arguments));
      }
      (_.prototype.clone = function () {
        return this._runTask(Cr('clone', ye, ...arguments), d(arguments));
      }),
        (_.prototype.mirror = function () {
          return this._runTask(Cr('mirror', lt, ...arguments), d(arguments));
        }),
        (_.prototype.mv = function (f, g) {
          return this._runTask(Pi(f, g), d(arguments));
        }),
        (_.prototype.checkoutLatestTag = function (f) {
          var g = this;
          return this.pull(function () {
            g.tags(function (C, D) {
              g.checkout(D.latest, f);
            });
          });
        }),
        (_.prototype.pull = function (f, g, C, D) {
          return this._runTask($i(h(f, c), h(g, c), m(arguments)), d(arguments));
        }),
        (_.prototype.fetch = function (f, g) {
          return this._runTask(Ri(h(f, c), h(g, c), m(arguments)), d(arguments));
        }),
        (_.prototype.silent = function (f) {
          return (
            console.warn(
              'simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3'
            ),
            this
          );
        }),
        (_.prototype.tags = function (f, g) {
          return this._runTask(Qi(m(arguments)), d(arguments));
        }),
        (_.prototype.rebase = function () {
          return this._runTask(z(['rebase', ...m(arguments)]), d(arguments));
        }),
        (_.prototype.reset = function (f) {
          return this._runTask(Vi(Hi(f), m(arguments)), d(arguments));
        }),
        (_.prototype.revert = function (f) {
          let g = d(arguments);
          return typeof f != 'string'
            ? this._runTask(i('Commit must be a string'), g)
            : this._runTask(z(['revert', ...m(arguments, 0, !0), f]), g);
        }),
        (_.prototype.addTag = function (f) {
          let g = typeof f == 'string' ? Ki(f) : i('Git.addTag requires a tag name');
          return this._runTask(g, d(arguments));
        }),
        (_.prototype.addAnnotatedTag = function (f, g) {
          return this._runTask(zi(f, g), d(arguments));
        }),
        (_.prototype.deleteLocalBranch = function (f, g, C) {
          return this._runTask(ct(f, typeof g == 'boolean' ? g : !1), d(arguments));
        }),
        (_.prototype.deleteLocalBranches = function (f, g, C) {
          return this._runTask(ce(f, typeof g == 'boolean' ? g : !1), d(arguments));
        }),
        (_.prototype.branch = function (f, g) {
          return this._runTask(F(m(arguments)), d(arguments));
        }),
        (_.prototype.branchLocal = function (f) {
          return this._runTask(Q(), d(arguments));
        }),
        (_.prototype.raw = function (f) {
          let g = !Array.isArray(f),
            C = [].slice.call(g ? arguments : f, 0);
          for (let U = 0; U < C.length && g; U++)
            if (!u(C[U])) {
              C.splice(U, C.length - U);
              break;
            }
          C.push(...m(arguments, 0, !0));
          var D = d(arguments);
          return C.length
            ? this._runTask(z(C, this._trimmed), D)
            : this._runTask(i('Raw: must supply one or more command to execute'), D);
        }),
        (_.prototype.submoduleAdd = function (f, g, C) {
          return this._runTask(qi(f, g), d(arguments));
        }),
        (_.prototype.submoduleUpdate = function (f, g) {
          return this._runTask(Wi(m(arguments, !0)), d(arguments));
        }),
        (_.prototype.submoduleInit = function (f, g) {
          return this._runTask(Gi(m(arguments, !0)), d(arguments));
        }),
        (_.prototype.subModule = function (f, g) {
          return this._runTask(Ui(m(arguments)), d(arguments));
        }),
        (_.prototype.listRemote = function () {
          return this._runTask(Li(m(arguments)), d(arguments));
        }),
        (_.prototype.addRemote = function (f, g, C) {
          return this._runTask(Di(f, g, m(arguments)), d(arguments));
        }),
        (_.prototype.removeRemote = function (f, g) {
          return this._runTask(ji(f), d(arguments));
        }),
        (_.prototype.getRemotes = function (f, g) {
          return this._runTask(Ii(f === !0), d(arguments));
        }),
        (_.prototype.remote = function (f, g) {
          return this._runTask(Ni(m(arguments)), d(arguments));
        }),
        (_.prototype.tag = function (f, g) {
          let C = m(arguments);
          return C[0] !== 'tag' && C.unshift('tag'), this._runTask(z(C), d(arguments));
        }),
        (_.prototype.updateServerInfo = function (f) {
          return this._runTask(z(['update-server-info']), d(arguments));
        }),
        (_.prototype.pushTags = function (f, g) {
          let C = Mi({ remote: h(f, c) }, m(arguments));
          return this._runTask(C, d(arguments));
        }),
        (_.prototype.rm = function (f) {
          return this._runTask(z(['rm', '-f', ...o(f)]), d(arguments));
        }),
        (_.prototype.rmKeepLocal = function (f) {
          return this._runTask(z(['rm', '--cached', ...o(f)]), d(arguments));
        }),
        (_.prototype.catFile = function (f, g) {
          return this._catFile('utf-8', arguments);
        }),
        (_.prototype.binaryCatFile = function () {
          return this._catFile('buffer', arguments);
        }),
        (_.prototype._catFile = function (f, g) {
          var C = d(g),
            D = ['cat-file'],
            U = g[0];
          if (typeof U == 'string')
            return this._runTask(i('Git.catFile: options must be supplied as an array of strings'), C);
          Array.isArray(U) && D.push.apply(D, U);
          let ft = f === 'buffer' ? Yi(D) : z(D);
          return this._runTask(ft, C);
        }),
        (_.prototype.diff = function (f, g) {
          let C = c(f)
            ? i('git.diff: supplying options as a single string is no longer supported, switch to an array of strings')
            : z(['diff', ...m(arguments)]);
          return this._runTask(C, d(arguments));
        }),
        (_.prototype.diffSummary = function () {
          return this._runTask(Fi(m(arguments, 1)), d(arguments));
        }),
        (_.prototype.applyPatch = function (f) {
          let g = l(f)
            ? S(o(f), m([].slice.call(arguments, 1)))
            : i('git.applyPatch requires one or more string patches as the first argument');
          return this._runTask(g, d(arguments));
        }),
        (_.prototype.revparse = function () {
          let f = ['rev-parse', ...m(arguments, !0)];
          return this._runTask(z(f, !0), d(arguments));
        }),
        (_.prototype.clean = function (f, g, C) {
          let D = ht(f),
            U = (D && f.join('')) || h(f, c) || '',
            ft = m([].slice.call(arguments, D ? 1 : 0));
          return this._runTask($e(U, ft), d(arguments));
        }),
        (_.prototype.exec = function (f) {
          let g = {
            commands: [],
            format: 'utf-8',
            parser() {
              typeof f == 'function' && f();
            },
          };
          return this._runTask(g);
        }),
        (_.prototype.clearQueue = function () {
          return this;
        }),
        (_.prototype.checkIgnore = function (f, g) {
          return this._runTask(le(o(h(f, l, []))), d(arguments));
        }),
        (_.prototype.checkIsRepo = function (f, g) {
          return this._runTask(kr(h(f, c)), d(arguments));
        }),
        (e.exports = _);
    },
  });
Se();
te();
var Mc = class extends J {
  constructor(t, e) {
    super(void 0, e), (this.config = t);
  }
};
te();
te();
var oe = class extends J {
  constructor(t, e, r) {
    super(t, r), (this.task = t), (this.plugin = e), Object.setPrototypeOf(this, new.target.prototype);
  }
};
be();
$n();
Jn();
us();
hs();
ms();
bs();
function Dc(t) {
  return t
    ? [
        {
          type: 'spawn.before',
          action(n, s) {
            t.aborted && s.kill(new oe(void 0, 'abort', 'Abort already signaled'));
          },
        },
        {
          type: 'spawn.after',
          action(n, s) {
            function i() {
              s.kill(new oe(void 0, 'abort', 'Abort signal received'));
            }
            t.addEventListener('abort', i), s.spawned.on('close', () => t.removeEventListener('abort', i));
          },
        },
      ]
    : void 0;
}
function Ic(t) {
  return typeof t == 'string' && t.trim().toLowerCase() === '-c';
}
function Lc(t, e) {
  if (Ic(t) && /^\s*protocol(.[a-z]+)?.allow/.test(e))
    throw new oe(
      void 0,
      'unsafe',
      'Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol'
    );
}
function Nc(t, e) {
  if (/^\s*--(upload|receive)-pack/.test(t))
    throw new oe(
      void 0,
      'unsafe',
      'Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack'
    );
  if (e === 'clone' && /^\s*-u\b/.test(t))
    throw new oe(void 0, 'unsafe', 'Use of clone with option -u is not permitted without enabling allowUnsafePack');
  if (e === 'push' && /^\s*--exec\b/.test(t))
    throw new oe(void 0, 'unsafe', 'Use of push with option --exec is not permitted without enabling allowUnsafePack');
}
function jc({ allowUnsafeProtocolOverride: t = !1, allowUnsafePack: e = !1 } = {}) {
  return {
    type: 'spawn.args',
    action(r, n) {
      return (
        r.forEach((s, i) => {
          let o = i < r.length ? r[i + 1] : '';
          t || Lc(s, o), e || Nc(s, n.method);
        }),
        r
      );
    },
  };
}
b();
function Hc(t) {
  let e = Oe(t, '-c');
  return {
    type: 'spawn.args',
    action(r) {
      return [...e, ...r];
    },
  };
}
b();
var xn = (0, ge.deferred)().promise;
function Vc({ onClose: t = !0, onExit: e = 50 } = {}) {
  function r() {
    let s = -1,
      i = {
        close: (0, ge.deferred)(),
        closeTimeout: (0, ge.deferred)(),
        exit: (0, ge.deferred)(),
        exitTimeout: (0, ge.deferred)(),
      },
      o = Promise.race([t === !1 ? xn : i.closeTimeout.promise, e === !1 ? xn : i.exitTimeout.promise]);
    return (
      n(t, i.close, i.closeTimeout),
      n(e, i.exit, i.exitTimeout),
      {
        close(a) {
          (s = a), i.close.done();
        },
        exit(a) {
          (s = a), i.exit.done();
        },
        get exitCode() {
          return s;
        },
        result: o,
      }
    );
  }
  function n(s, i, o) {
    s !== !1 && (s === !0 ? i.promise : i.promise.then(() => Nt(s))).then(o.done);
  }
  return {
    type: 'spawn.after',
    action(s, i) {
      return Ce(this, arguments, function* (o, { spawned: a, close: u }) {
        var c, l;
        let h = r(),
          m = !0,
          d = () => void (m = !1);
        (c = a.stdout) == null || c.on('data', d),
          (l = a.stderr) == null || l.on('data', d),
          a.on('error', d),
          a.on('close', (v) => h.close(v)),
          a.on('exit', (v) => h.exit(v));
        try {
          yield h.result, m && (yield Nt(50)), u(h.exitCode);
        } catch (v) {
          u(h.exitCode, v);
        }
      });
    },
  };
}
te();
function Bc(t) {
  return !!(t.exitCode && t.stdErr.length);
}
function qc(t) {
  return Buffer.concat([...t.stdOut, ...t.stdErr]);
}
function Gc(t = !1, e = Bc, r = qc) {
  return (n, s) => ((!t && n) || !e(s) ? n : r(s));
}
function Fn(t) {
  return {
    type: 'task.error',
    action(e, r) {
      let n = t(e.error, { stdErr: r.stdErr, stdOut: r.stdOut, exitCode: r.exitCode });
      return Buffer.isBuffer(n) ? { error: new J(void 0, n.toString('utf-8')) } : { error: n };
    },
  };
}
b();
var Uc = class {
  constructor() {
    this.plugins = new Set();
  }
  add(t) {
    let e = [];
    return (
      ee(t).forEach((r) => r && this.plugins.add(k(e, r))),
      () => {
        e.forEach((r) => this.plugins.delete(r));
      }
    );
  }
  exec(t, e, r) {
    let n = e,
      s = Object.freeze(Object.create(r));
    for (let i of this.plugins) i.type === t && (n = i.action(n, s));
    return n;
  }
};
b();
function Wc(t) {
  let e = '--progress',
    r = ['checkout', 'clone', 'fetch', 'pull', 'push'];
  return [
    {
      type: 'spawn.args',
      action(i, o) {
        return r.includes(o.method) ? jn(i, e) : i;
      },
    },
    {
      type: 'spawn.after',
      action(i, o) {
        var a;
        o.commands.includes(e) &&
          ((a = o.spawned.stderr) == null ||
            a.on('data', (u) => {
              let c = /^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(u.toString('utf8'));
              c && t({ method: o.method, stage: zc(c[1]), progress: O(c[2]), processed: O(c[3]), total: O(c[4]) });
            }));
      },
    },
  ];
}
function zc(t) {
  return String(t.toLowerCase().split(' ', 1)) || 'unknown';
}
b();
function Kc(t) {
  let e = Vn(t, ['uid', 'gid']);
  return {
    type: 'spawn.options',
    action(r) {
      return G(G({}, e), r);
    },
  };
}
function Qc({ block: t, stdErr: e = !0, stdOut: r = !0 }) {
  if (t > 0)
    return {
      type: 'spawn.after',
      action(n, s) {
        var i, o;
        let a;
        function u() {
          a && clearTimeout(a), (a = setTimeout(l, t));
        }
        function c() {
          var h, m;
          (h = s.spawned.stdout) == null || h.off('data', u),
            (m = s.spawned.stderr) == null || m.off('data', u),
            s.spawned.off('exit', c),
            s.spawned.off('close', c),
            a && clearTimeout(a);
        }
        function l() {
          c(), s.kill(new oe(void 0, 'timeout', 'block timeout reached'));
        }
        r && ((i = s.spawned.stdout) == null || i.on('data', u)),
          e && ((o = s.spawned.stderr) == null || o.on('data', u)),
          s.spawned.on('exit', c),
          s.spawned.on('close', c),
          u();
      },
    };
}
Se();
function Yc() {
  return {
    type: 'spawn.args',
    action(t) {
      let e = [],
        r;
      function n(s) {
        (r = r || []).push(...s);
      }
      for (let s = 0; s < t.length; s++) {
        let i = t[s];
        if (Ke(i)) {
          n(tn(i));
          continue;
        }
        if (i === '--') {
          n(t.slice(s + 1).flatMap((o) => (Ke(o) && tn(o)) || o));
          break;
        }
        e.push(i);
      }
      return r ? [...e, '--', ...r.map(String)] : e;
    },
  };
}
b();
var Jc = $c();
function Xc(t, e) {
  let r = new Uc(),
    n = Un((t && (typeof t == 'string' ? { baseDir: t } : t)) || {}, e);
  if (!Xt(n.baseDir)) throw new Mc(n, 'Cannot use simple-git on a directory that does not exist');
  return (
    Array.isArray(n.config) && r.add(Hc(n.config)),
    r.add(jc(n.unsafe)),
    r.add(Yc()),
    r.add(Vc(n.completion)),
    n.abort && r.add(Dc(n.abort)),
    n.progress && r.add(Wc(n.progress)),
    n.timeout && r.add(Qc(n.timeout)),
    n.spawnOptions && r.add(Kc(n.spawnOptions)),
    r.add(Fn(Gc(!0))),
    n.errors && r.add(Fn(n.errors)),
    new Jc(n, r)
  );
}
be();
var Ei = Xc;
var re = ne(require('fs')),
  ut = ne(require('path'));
async function xi(t, e = '100') {
  try {
    let r = Ei(t),
      n = ut.default.join(t, 'packages');
    if (!re.default.existsSync(n) || !re.default.statSync(n).isDirectory())
      throw new Error("'packages' directory does not exist in the repository.");
    let s = new Map(),
      i = re.default.readdirSync(n).filter((a) => re.default.statSync(ut.default.join(n, a)).isDirectory());
    for (let a of i) {
      let u = `packages/${a}`,
        c = ['-n', e, '--', u];
      (await r.log(c)).all.forEach((h) => {
        let m = h.author_name;
        s.set(m, (s.get(m) || 0) + 1);
      });
    }
    let o = 0;
    return (
      s.forEach((a) => {
        a > 1 && o++;
      }),
      await Zc(t, o),
      o
    );
  } catch (r) {
    throw (console.error('Error:', r.message), r);
  }
}
async function Zc(t, e) {
  let r = ut.default.join(t, 'README.md'),
    n = '';
  re.default.existsSync(r) && (n = re.default.readFileSync(r, 'utf-8'));
  let s = `## Contributor Metrics
Number of contributors who worked on multiple projects: ${e}
`;
  n.includes('## Contributor Metrics') ? (n = n.replace(/## Contributor Metrics[\s\S]*/, s)) : (n += s),
    re.default.writeFileSync(r, n);
}
var vr = new jr();
vr.version('1.0.0').description('CLI to gather metrics on cross collaboration in a git repository');
vr.command('analyze <repositoryPath>')
  .description('Analyze the specified git repository')
  .option('-n, --num-commits <number>', 'Number of commits to analyze in each subfolder', '100')
  .action((t, e) => {
    xi(t, e.numCommits)
      .then((r) => {
        console.log(`Number of contributors who worked on multiple projects: ${r}`);
      })
      .catch((r) => {
        console.error('Error:', r.message);
      });
  });
vr.parse(process.argv);
