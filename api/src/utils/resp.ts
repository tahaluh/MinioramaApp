const resp = (s: number, m: any) => ({ status: s, message: m });

const respM = (s: number, m: any) => ({
  status: s,
  message: { message: m },
});

export { resp, respM };
