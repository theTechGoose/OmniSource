import '@global_models'


//@ts-ignore:
// INTERFACE MUST BE STATIC
// T MUST BE PASSED AS "TYPEOF"
export type I<T extends any> = InstanceType<T['interface']>;
