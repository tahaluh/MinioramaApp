const resp = (s: number, m: unknown) => ({ status: s, message: m });

const respM = (s: number, m: unknown) => ({
  status: s,
  message: { message: m },
});

export { resp, respM };
